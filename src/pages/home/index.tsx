import { useCallback, useMemo, useRef } from 'react';
import {
  addDays,
  addWeeks,
  startOfWeek,
  getISOWeek,
  format,
  parseISO,
  isValid,
  isEqual,
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { GrCaretPrevious, GrCaretNext } from 'react-icons/gr';
import { useSearchParams } from 'react-router';
import styles from './home.module.scss';
import { useGetTasks } from '~/hooks/api/tasks';
import Button from '~/components/Button';
import ModalEditTask from '~/components/ModalEditTask';
import Task from '~/components/DashboardTasks/Task';
import type { ModalRefProps } from '~/components/Modal';
import type { ITask } from '~/types/tasks';

const Home = () => {
  const modalEditTaskRef = useRef<ModalRefProps>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const currentDate = useMemo(() => {
    const dateParam = searchParams.get('date');
    if (!dateParam) return new Date();

    const parsedDate = parseISO(dateParam);
    return isValid(parsedDate) ? parsedDate : new Date();
  }, [searchParams]);

  const daysOfWeek = useMemo(() => {
    const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    return new Array(7).fill(null).map((_, index: number) => addDays(firstDayOfWeek, index));
  }, [currentDate]);

  const { data: tasks } = useGetTasks({
    minDate: format(daysOfWeek[0], 'yyyy-MM-dd'),
    maxDate: format(daysOfWeek[daysOfWeek.length - 1], 'yyyy-MM-dd'),
  });

  const changeWeek = (dir: 'prev' | 'next') => {
    const nextDate = addWeeks(currentDate, dir === 'prev' ? -1 : 1);
    setSearchParams({ date: format(nextDate, 'yyyy-MM-dd') });
  };

  const selectDate = (date: Date) => {
    setSearchParams({ date: format(date, 'yyyy-MM-dd') });
  };

  const weekMessage = useMemo(() => {
    const currentWeekIndex = getISOWeek(new Date());
    const dateWeekIndex = getISOWeek(currentDate);
    const offsetWeek = dateWeekIndex - currentWeekIndex;

    let str = `Semaine ${dateWeekIndex}`;
    if (offsetWeek === 0) {
      str = 'Cette semaine';
    } else if (offsetWeek === 1) {
      str = 'La semaine prochaine';
    } else if (offsetWeek === -1) {
      str = 'La semaine dernière';
    }

    return str;
  }, [currentDate]);

  const isDateSelected = useCallback((date: Date) => isEqual(date, currentDate), [currentDate]);

  return (
    <>
      <ModalEditTask ref={modalEditTaskRef} />
      <div className={styles.content}>
        <div className={styles.weekHeader}>
          <nav>
            <button onClick={() => changeWeek('prev')}>
              <GrCaretPrevious />
            </button>
            <h1>{weekMessage}</h1>
            <button onClick={() => changeWeek('next')}>
              <GrCaretNext />
            </button>
          </nav>
          <Button onClick={() => modalEditTaskRef.current?.open()}>Ajouter une tâche</Button>
        </div>
        <div className={styles.days}>
          {daysOfWeek.map(day => (
            <a
              role="button"
              key={day.toISOString()}
              className={isDateSelected(day) ? styles.selected : ''}
              onClick={() => selectDate(day)}
            >
              {format(day, 'EEE dd', { locale: fr })}
            </a>
          ))}
        </div>
        <div className={styles.tasks}>
          {tasks?.map((task: ITask) => (
            <Task
              key={task._id}
              id={task._id}
              description={task.description}
              completed={task.completed}
              dueDate={task.dueDate}
              tags={task.tags}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
