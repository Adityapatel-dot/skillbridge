import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'
import Button from './Button'

export function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn('flex flex-col items-center justify-center py-16 px-4 text-center', className)}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-4">
        {Icon && <Icon className="w-8 h-8 text-primary-300" />}
      </div>
      <h3 className="text-heading-4 text-primary-500 mb-2">{title}</h3>
      <p className="text-body-sm text-muted max-w-sm mb-6">{description}</p>
      {action && <Button {...action} />}
    </motion.div>
  )
}
