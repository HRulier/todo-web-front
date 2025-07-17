import React, { useState, useRef, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { MdAdd } from 'react-icons/md';
import styles from './dashboard-tasks.module.scss';
import { useUpdateTask } from '~/hooks/api/tasks';

import Task from '~/components/DashboardTasks/Task';
import Button from '~/components/Button';
import Loader from '~/components/Loader';
import type { ITask } from '~/types/tasks';
import ModalAddTask from '~/components/ModalAddTask';
import type { ModalAddTaskRefProps } from '~/components/ModalAddTask';

interface GroupedTasks {
  [key: string]: {
    date: Date;
    tasks: ITask[];
  };
}

const DAYS_ORDER = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DashboardTasks = ({ tasks, daysOfWeek }: { tasks: ITask[]; daysOfWeek: Date[] }) => {
  const { mutateAsync: updateTask } = useUpdateTask();

  const modalAddTaskRef = useRef<ModalAddTaskRefProps>(null);

  const [draggedTask, setDraggedTask] = useState<ITask | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
  const [dropIndicator, setDropIndicator] = useState<{
    day: string | null;
    index: number | null;
    loading: boolean;
  }>({
    day: null,
    index: null,
    loading: false,
  });
  const dragCounter = useRef<{ [key: string]: number }>({});

  const groupedTasks = useMemo(() => {
    const grouped: GroupedTasks = {};
    daysOfWeek.forEach((date: Date) => {
      const day = format(date, 'eee', { locale: enUS });
      grouped[day] = {
        date,
        tasks: [],
      };
    });

    tasks?.forEach((task: ITask) => {
      try {
        const taskDate = new Date(task.date);
        const day = format(taskDate, 'eee', { locale: enUS });

        if (grouped[day]) {
          grouped[day].tasks.push(task);
        }
      } catch (error) {
        console.warn('Invalid task date:', task.date, error);
      }
    });

    return grouped;
  }, [tasks, daysOfWeek]);

  const getDropIndex = (e: React.DragEvent<HTMLDivElement>, tasksInDay: ITask[]) => {
    const container = e.currentTarget;
    const taskElements = container.querySelectorAll('[data-task-id]');

    if (taskElements.length === 0) {
      return 0; // Empty list, insert at beginning
    }

    let dropIndex = tasksInDay.length; // Default to end

    for (let i = 0; i < taskElements.length; i++) {
      const taskElement = taskElements[i];
      const rect = taskElement.getBoundingClientRect();
      const taskMiddle = rect.top + rect.height / 2;

      if (e.clientY < taskMiddle) {
        dropIndex = i;
        break;
      }
    }

    return dropIndex;
  };

  const getNewPosition = (tasks: ITask[], targetIndex: number) => {
    if (tasks.length === 0) return 1024; // Premier élément

    if (targetIndex === 0) {
      return tasks[0].position / 2;
    }

    if (targetIndex >= tasks.length) {
      return tasks[tasks.length - 1].position + 1024;
    }

    return (tasks[targetIndex - 1].position + tasks[targetIndex].position) / 2;
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, task: ITask, day: string) => {
    setDraggedTask(task);
    setDraggedFrom(day);
    e.dataTransfer.effectAllowed = 'move';

    const counters: { [key: string]: number } = {};

    daysOfWeek.forEach((date: Date) => {
      const d = format(date, 'eee', { locale: enUS });
      counters[d] = 0;
    });
    dragCounter.current = counters;
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDraggedFrom(null);
    dragCounter.current = {};

    setDropIndicator(prev => (prev.loading ? prev : { day: null, index: null, loading: false }));
  };

  const handleTaskDragOver = (e: React.DragEvent<HTMLDivElement>, day: string) => {
    e.preventDefault();
    if (!draggedTask) return;

    const tasksInDay = groupedTasks[day].tasks || [];
    const dropIndex = getDropIndex(e, tasksInDay);

    setDropIndicator({ day, index: dropIndex, loading: false });
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, day: string) => {
    e.preventDefault();
    if (!dragCounter.current[day]) dragCounter.current[day] = 0;
    dragCounter.current[day] += 1;
  };

  const handleDragLeave = (day: string) => {
    if (!dragCounter.current[day]) return;
    dragCounter.current[day] -= 1;

    if (dragCounter.current[day] <= 0) {
      dragCounter.current[day] = 0;
      if (dropIndicator.day === day) {
        setDropIndicator({ day: null, index: null, loading: false });
      }
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, targetDay: string, date: Date) => {
    e.preventDefault();

    if (!draggedTask || !draggedFrom) {
      setDropIndicator({ day: null, index: null, loading: false });
      return;
    }

    const tasksInDay = groupedTasks[targetDay].tasks || [];

    const dropIndex = getDropIndex(e, tasksInDay);
    const newPosition = getNewPosition(tasksInDay, dropIndex);

    setDropIndicator({ day: dropIndicator.day, index: dropIndicator.index, loading: true });

    try {
      await updateTask({
        id: draggedTask._id,
        task: {
          position: newPosition,
          date: date.toISOString(),
          completed: draggedTask.completed,
        },
      });
    } finally {
      setDropIndicator({ day: null, index: null, loading: false });
      dragCounter.current = {};
    }
  };

  const handleAddTask = useCallback((date: string) => {
    modalAddTaskRef.current?.open(date);
  }, []);

  const DropIndicator = ({ isLoading, isVisible }: { isLoading: boolean; isVisible: boolean }) => {
    if (!isVisible) return null;

    if (isLoading)
      return (
        <div className={styles.loader}>
          <Loader small />
        </div>
      );
    return <div className={styles.dropIndicator} />;
  };

  return (
    <>
      <ModalAddTask ref={modalAddTaskRef} />
      <div className={styles.weekGrid}>
        {DAYS_ORDER.map(day => (
          <div className={styles.dayColumn} key={day}>
            <h4>
              {groupedTasks[day] ? format(groupedTasks[day].date, 'EEE dd', { locale: fr }) : day}
            </h4>
            <div
              className={styles.tasksContainer}
              role="region"
              onDragOver={e => handleTaskDragOver(e, day)}
              onDragEnter={e => handleDragEnter(e, day)}
              onDragLeave={() => handleDragLeave(day)}
              onDrop={e => handleDrop(e, day, groupedTasks[day].date)}
            >
              {groupedTasks[day].tasks?.length > 0 && (
                <DropIndicator
                  isLoading={dropIndicator.loading}
                  isVisible={dropIndicator.day === day && dropIndicator.index === 0}
                />
              )}

              {(groupedTasks[day].tasks || [])
                .sort((a, b) => a.position - b.position)
                .map((task: ITask, index: number) => (
                  <React.Fragment key={task._id}>
                    <div
                      role="listitem"
                      data-task-id={task._id}
                      draggable
                      onDragStart={e => handleDragStart(e, task, day)}
                      onDragEnd={handleDragEnd}
                      style={{
                        opacity: draggedTask && draggedTask._id === task._id ? 0.5 : 1,
                      }}
                    >
                      <Task
                        key={task._id}
                        id={task._id}
                        description={task.description}
                        completed={task.completed}
                      />
                    </div>
                    <DropIndicator
                      isLoading={dropIndicator.loading}
                      isVisible={dropIndicator.day === day && dropIndicator.index === index + 1}
                    />
                  </React.Fragment>
                ))}
              {groupedTasks[day].tasks.length === 0 && (
                <>
                  <Button
                    variant="outline"
                    onClick={() => handleAddTask(groupedTasks[day].date.toISOString())}
                  >
                    <MdAdd size={25} />
                  </Button>
                  <DropIndicator
                    isLoading={dropIndicator.loading}
                    isVisible={dropIndicator.day === day}
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardTasks;
