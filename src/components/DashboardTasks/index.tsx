import { useRef, useMemo, useCallback } from 'react';
import { format } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import { MdAdd } from 'react-icons/md';
import styles from './dashboard-tasks.module.scss';
import Task from '~/components/Task';
import Button from '~/components/Button';
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
  const modalAddTaskRef = useRef<ModalAddTaskRefProps>(null);

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

  const handleAddTask = useCallback((date: string) => {
    modalAddTaskRef.current?.open(date);
  }, []);

  return (
    <>
      <ModalAddTask ref={modalAddTaskRef} />
      <div className={styles.weekGrid}>
        {DAYS_ORDER.map(day => (
          <div className={styles.dayColumn} key={day}>
            <h4>
              {groupedTasks[day] ? format(groupedTasks[day].date, 'EEE dd', { locale: fr }) : day}
            </h4>
            <div className={styles.tasksContainer}>
              {(groupedTasks[day].tasks || []).map((task: ITask) => (
                <Task
                  key={task._id}
                  id={task._id}
                  description={task.description}
                  completed={task.completed}
                />
              ))}
              {groupedTasks[day].tasks.length === 0 && (
                <Button
                  variant="outline"
                  onClick={() => handleAddTask(groupedTasks[day].date.toISOString())}
                >
                  <MdAdd size={25} />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardTasks;
