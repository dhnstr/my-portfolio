import React from 'react';
import { motion } from 'motion/react';

const Reveal = ({ children, delay = 0, y = 28, x = 0, className }) => (
    <motion.div
        initial={{ opacity: 0, y, x }}
        whileInView={{ opacity: 1, y: 0, x: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
        className={className}
    >
        {children}
    </motion.div>
);

export default Reveal;
