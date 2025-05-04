import React, { useState, useEffect } from 'react';
import styles from '../styles/ReleaseSpinnerRow.module.css';

export const ReleaseSpinnerRow = ({
  releaseConfidence,
  triggerSpin,
  resetSpinnerTrigger,
  onSpinComplete,
  netValue,
}: {
  releaseConfidence: number;
  triggerSpin: boolean;
  resetSpinnerTrigger: number;
  onSpinComplete: (success: boolean) => void;
  netValue: number;
}) => {
  const segments = Array.from({ length: 10 }, (_, i) => i);
  const [current, setCurrent] = useState<number | null>(null);
  const [successful, setSuccessful] = useState<boolean | null>(null);
  const [finalTarget, setFinalTarget] = useState<number | null>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {}, [resetSpinnerTrigger]);

  useEffect(() => {
    if (triggerSpin) {
      setSuccessful(null);
      setSpinning(true);

      let steps = 20 + Math.floor(Math.random() * segments.length);
      let speed = 50;

      const roll = Math.floor(Math.random() * 100) + 1;
      const success = roll <= releaseConfidence;

      const greenSegments = Math.floor((releaseConfidence / 100) * segments.length);
      const targetIndexes = success
        ? segments.slice(0, greenSegments)
        : segments.slice(greenSegments);

      const target = targetIndexes[Math.floor(Math.random() * targetIndexes.length)];
      setFinalTarget(target);

      const spin = () => {
        setCurrent((prev) => {
          const next = prev === null ? 0 : (prev + 1) % segments.length;
          return next;
        });

        if (steps > 0) {
          setTimeout(spin, speed);
          steps--;

          if (steps < 10) {
            speed += 30;
          }
        } else {
          setSpinning(false);
          setCurrent(target);
          setSuccessful(success);
          onSpinComplete(success);
        }
      };

      spin();
    }
  }, [triggerSpin]);

  const greenSegments = Math.floor((releaseConfidence / 100) * segments.length);

  return (
    <div className={styles.releaseStatusContainer}>
      <div className={styles.releaseStatusLeft}>
        <div className={styles.releaseStatusTitle}>
          <strong>Release Deployed Successful?</strong>
          <span className={styles.statusIcon}>
            {successful == null ? '' : successful ? '✅' : '❌'}
          </span>
        </div>

        <div className={styles.releaseBar}>
          {segments.map((_, idx) => {
            const isGreen = idx < greenSegments;
            const isActive = spinning ? idx === current : idx === finalTarget;

            return (
              <div
                key={idx}
                className={`${styles.segment} ${isGreen ? styles.green : styles.red} ${
                  isActive ? styles.active : ''
                }`}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.releaseStatusRight}>
        <div className={styles.valueLabel}>Value Delivered</div>
        <div
          className={styles.valueBox}
          style={{ color: successful ? 'green' : 'red' }}
        >
          {successful ? netValue : 0}
        </div>
      </div>
    </div>
  );
};
