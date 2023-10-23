import clsx from 'clsx'
import { PrimaryButton } from '@components/buttons'
import { CircularLoader } from '@components/buttons/JoinCommunityButton'

export const Pagination = ({ currentPage = 1, totalPages, onPageChange }) => {
  const radius = 100
  const sliceAngle = 360 / totalPages
  return (
    <div className="sticky left-0 top-0 z-[20]    flex select-none items-center rounded border-white  p-2 text-white">
      <PrimaryButton
        resetClasses={true}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="bg-primary-500 hover:bg-primary-500/50 disabled:bg-primary-300 disabled:hover:bg-primary-300 -me-2  h-8 w-28 rounded-l px-2 py-1 focus:select-none focus:outline-none"
      >
        Previous
      </PrimaryButton>
      {!totalPages ? (
        <CircularLoader className={'aspect-1 bg-primary-500 !h-20 !w-20 !rounded-full'} />
      ) : (
        <div className="bg-primary-400 relative z-10 flex h-20 w-20 items-center justify-center rounded-full  border-none">
          <svg
            viewBox={`-${radius} -${radius} ${radius * 2} ${radius * 2}`}
            className="outline-primary-400 absolute left-0 top-0 h-full w-full   rounded-full outline outline-4 -outline-offset-4"
          >
            {Array.from({ length: totalPages }).map((_, i) => (
              <PieSlice
                key={i}
                radius={radius}
                startAngle={i * sliceAngle}
                endAngle={(i + 1) * sliceAngle}
                filled={i < currentPage + 1}
              />
            ))}
          </svg>
          <div className="aspect-1 bg-primary-400 absolute flex items-center justify-center rounded-full border border-white p-3 text-xs">
            {currentPage + 1} / {totalPages}
          </div>
        </div>
      )}
      <PrimaryButton
        resetClasses={true}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages - 1}
        className=" bg-primary-500 hover:bg-primary-500/50 disabled:bg-primary-300 disabled:hover:bg-primary-300 -ms-2 h-8 w-28 select-none rounded-r px-2   py-1 focus:select-none focus:outline-none"
      >
        Next
      </PrimaryButton>
    </div>
  )
}

const PieSlice = ({ radius, startAngle, endAngle, filled }) => {
  const x1 = radius * Math.cos((Math.PI * startAngle) / 180)
  const y1 = radius * Math.sin((Math.PI * startAngle) / 180)
  const x2 = radius * Math.cos((Math.PI * endAngle) / 180)
  const y2 = radius * Math.sin((Math.PI * endAngle) / 180)
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return (
    <path
      className={clsx('text-white', filled ? 'fill-primary-500' : 'fill-primary-400')}
      d={`M0,0 L${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2} z`}
      stroke="white"
      strokeWidth="0.5"
    />
  )
}
