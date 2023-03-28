import React, { ElementType, useId, useRef, useState } from 'react'
import { arrow, FloatingPortal, useFloating, shift, offset, Placement } from '@floating-ui/react'
import { AnimatePresence, motion } from 'framer-motion'

interface Props {
  children: React.ReactNode
  renderPopover: React.ReactNode
  className?: string
  as?: ElementType
  initialOpen?: boolean
  placement?: Placement
}
export default function Popover({
  children,
  renderPopover,
  className,
  as: Element = 'div',
  initialOpen,
  placement = 'bottom-end'
}: Props) {
  const [open, setOpen] = useState(initialOpen || false)
  const arrowRef = useRef<HTMLElement>(null)
  const idPopover = useId()
  const { x, y, reference, floating, strategy, middlewareData } = useFloating({
    middleware: [
      offset(5), // dịch chuyển lên xuống
      shift(),
      arrow({
        element: arrowRef
      })
    ],
    placement
  })

  const showPopover = () => {
    setOpen(true)
  }
  const hidePopover = () => {
    setOpen(false)
  }
  return (
    <Element className={className} ref={reference} onMouseEnter={showPopover} onMouseLeave={hidePopover}>
      {children}
      {/* tooltip language */}
      <FloatingPortal id={idPopover}>
        <AnimatePresence>
          {open && (
            <motion.div
              ref={floating}
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: 'max-content',
                transformOrigin: `${middlewareData.arrow?.x} top`
              }}
              initial={{ opacity: 0, transform: 'scale(0)' }} // handle phóng to thu nhỏ
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0)' }}
            >
              <span
                ref={arrowRef}
                className='absolute z-10 translate-y-[-95%] border-[11px] border-x-transparent border-t-transparent border-b-white'
                style={{
                  left: middlewareData.arrow?.x,
                  right: middlewareData.arrow?.y
                }}
              ></span>

              {renderPopover}
            </motion.div>
          )}
        </AnimatePresence>
      </FloatingPortal>
      {/* end tooltip language */}
    </Element>
  )
}
