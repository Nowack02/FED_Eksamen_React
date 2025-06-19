import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Exam } from '../types';
import { getExams, removeExam } from '../api/api';
import { ExamTable } from '../components/ExamTable';
import styles from './HistoryList.module.css';
import { useExamActions } from '../hooks/useExamActions';

export default function HistoryList() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const allExams = await getExams();
        const completedExams = allExams.filter(exam => exam.isCompleted === true);
        setExams(completedExams);
      } catch (err) {
        setError('Kunne ikke hente historik.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExams();
  }, []);

  const { deleteExam } = useExamActions();

  if (isLoading) return <p>Indlæser historik...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h2 className={styles.pageHeader}>Historik Oversigt</h2>
      {exams.length === 0 ? (
        <p>Der findes ingen afsluttede eksamener i historikken.</p>
      ) : (
        <ExamTable
          exams={exams}
          renderActions={(exam) => (
            <>
              <Link to={`/history/${exam.id}`} className={`${styles.button} ${styles.buttonSecondary}`}>
                Se Detaljer
              </Link>
              <button onClick={(e) => {
                e.preventDefault(); e.stopPropagation(); deleteExam(exam.id)}}
                className={`${styles.button} ${styles.dangerButton}`}>
                Slet
              </button>
            </>
          )}
        />
      )}
    </div>
  );
}