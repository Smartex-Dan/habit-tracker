import { motion } from "framer-motion";

interface AnimatedCheckmarkProps {
  size?: number;
}

export function AnimatedCheckmark({ size = 72 }: AnimatedCheckmarkProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 16 }}
    >
      <motion.circle
        cx="36"
        cy="36"
        r="32"
        stroke="var(--color-success)"
        strokeWidth="3.5"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
      <motion.path
        d="M21 36l10 10L51 26"
        stroke="var(--color-success)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
      />
    </motion.svg>
  );
}