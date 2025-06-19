import React from 'react';
import { Link } from 'react-router-dom';
import { Exam } from '../types';
import styles from './ExamTable.module.css';
import { formatDate } from '../utils/formatDate';

interface ExamTableProps {
  exams: Exam[];
  renderActions: (exam: Exam) => React.ReactNode; 
}

export const ExamTable: React.FC<ExamTableProps> = ({ exams, renderActions }) => {
  if (exams.length === 0) {
    return null; // Hvis der ingen eksamener er, vises tabellen slet ikke
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.examTable}>
        <thead>
          <tr>
            <th>Kursusnavn</th>
            <th>Termin</th>
            <th>Dato</th>
            <th style={{ width: '20%', textAlign: 'center'}}>Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {exams.map(exam => (
            <tr key={exam.id}>
              <td>
                  {exam.courseName}
              </td>
              <td>{exam.examtermin}</td>
              <td>{formatDate(exam.date)}</td>
              <td>
                <div className={styles.actionsCell}>
                  {renderActions(exam)}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};