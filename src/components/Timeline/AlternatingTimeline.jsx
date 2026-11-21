const AlternatingTimeline = ({items}) => {
  return (
    <div className="relative mx-auto max-w-4xl py-6">
      {/* Center Vertical Spine */}
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-4.5 w-0.5 -translate-x-1/2 bg-primary/25 sm:left-1/2"
      />

      <ul className="space-y-7">
        {items.map(({ icon: Icon, title }, index) => {
          const isLeft = index % 2 === 0;

          return (
            <li
              key={title}
              className="group grid grid-cols-[2.25rem_1fr] items-center gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:gap-5"
            >
              {/* Desktop Left Slot */}
              <div className="hidden min-w-0 sm:flex sm:items-center sm:justify-end">
                {isLeft && (
                  <>
                    <div className="w-full max-w-sm rounded-full border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
                      <div className="flex items-center gap-4">
                        {/* <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-6" strokeWidth={1.75} />
                        </span> */}
                        <h3 className="min-w-0 font-semibold leading-snug text-foreground">
                          {title}
                        </h3>
                      </div>
                    </div>
                    <span
                      aria-hidden="true"
                      className="h-0.5 w-5 shrink-0 bg-primary/35 transition-colors group-hover:bg-primary"
                    />
                  </>
                )}
              </div>

              {/* Center Spine Node */}
              <div className="relative z-10 flex items-center justify-center">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-xs font-bold text-primary shadow-sm transition-transform duration-300 group-hover:scale-110">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Mobile Card (Always on right of left-aligned spine) */}
              <div className="min-w-0 sm:hidden">
                <div className="rounded-2xl border border-border/70 bg-card p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    {/* <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span> */}
                    <h3 className="min-w-0 font-semibold leading-snug text-foreground">
                      {title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Desktop Right Slot */}
              <div className="hidden min-w-0 sm:flex sm:items-center sm:justify-start">
                {!isLeft && (
                  <>
                    <span
                      aria-hidden="true"
                      className="h-0.5 w-5 shrink-0 bg-primary/35 transition-colors group-hover:bg-primary"
                    />
                    <div className="w-full max-w-sm rounded-full border border-border/70 bg-card p-5 shadow-sm transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-primary/40 group-hover:shadow-md">
                      <div className="flex items-center gap-4">
                        {/* <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Icon className="size-6" strokeWidth={1.75} />
                        </span> */}
                        <h3 className="min-w-0 font-semibold leading-snug text-foreground">
                          {title}
                        </h3>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  )};

  export default AlternatingTimeline;