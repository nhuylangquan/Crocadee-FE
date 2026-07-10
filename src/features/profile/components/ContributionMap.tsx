import chevronDownUrl from '../../../assets/icons/profile-chevron-down.svg';

const DAYS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const WEEKS = 53;
const ROWS = 7;

// Stable data generation - runs once at module level
function buildYearData() {
  const data: { id: string; level: number }[] = [];
  for (let w = 0; w < WEEKS; w++) {
    for (let d = 0; d < ROWS; d++) {
      data.push({
        id: 'w' + String(w) + '-d' + String(d),
        level: Math.floor(Math.random() * 5),
      });
    }
  }
  return data;
}

const yearData = buildYearData();

const levelColors = [
  'bg-[#f0f0f5]',
  'bg-[#d4c9f0]',
  'bg-[#b09ae6]',
  'bg-[#8c6bdb]',
  'bg-[#630ed4]',
];

function getCell(weekIdx: number, dayIdx: number) {
  return yearData[weekIdx * ROWS + dayIdx];
}

export function ContributionMap() {
  return (
    <section className="rounded-xl border border-[#ccc3d84d] bg-white p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#1d1a24] md:text-xl">
          Contributions
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#4a4455]">This year</span>
          <img src={chevronDownUrl} alt="Dropdown" className="h-3 w-3" />
        </div>
      </div>

      {/* Heatmap */}
      <div className="flex gap-1">
        {/* Day labels column */}
        <div className="flex flex-col gap-0.75 pt-5">
          {DAYS.map((day, idx) => (
            <div
              key={'label-' + String(idx)}
              className="flex h-3.75 items-center"
            >
              {day !== '' && (
                <span className="text-[10px] leading-3.75 text-[#999]">
                  {day}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Grid area */}
        <div className="flex-1 overflow-x-auto">
          {/* Month labels row */}
          <div className="mb-0.75 flex gap-0.75">
            {MONTHS.map((month) => (
              <div
                key={month}
                className="flex"
                style={{ width: 'auto', minWidth: String(100 / 12) + '%' }}
              >
                <span className="text-[10px] leading-3.75 text-[#999]">
                  {month}
                </span>
              </div>
            ))}
          </div>

          {/* Grid - 53 columns x 7 rows */}
          <div className="flex gap-0.75">
            {Array.from({ length: WEEKS }).map((_, weekIdx) => (
              <div
                key={'week-' + String(weekIdx)}
                className="flex flex-col gap-0.75"
              >
                {Array.from({ length: ROWS }).map((_, dayIdx) => {
                  const cell = getCell(weekIdx, dayIdx);
                  return (
                    <div
                      key={cell.id}
                      className={
                        'h-3.75 w-3.75 rounded-sm ' + levelColors[cell.level]
                      }
                      title={String(cell.level * 25) + ' contributions'}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-[10px] text-[#999]">Less</span>
        {levelColors.map((color) => (
          <div key={color} className={'h-3.75 w-3.75 rounded-sm ' + color} />
        ))}
        <span className="text-[10px] text-[#999]">More</span>
      </div>
    </section>
  );
}
