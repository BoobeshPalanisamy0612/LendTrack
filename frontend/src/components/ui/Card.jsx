import { motion } from 'framer-motion';
import clsx from 'clsx';

const Card = ({ children, className, animate = true, ...props }) => {
  const Comp = animate ? motion.div : 'div';
  const animProps = animate
    ? { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3 } }
    : {};

  return (
    <Comp className={clsx('card-surface p-5', className)} {...animProps} {...props}>
      {children}
    </Comp>
  );
};

export default Card;
