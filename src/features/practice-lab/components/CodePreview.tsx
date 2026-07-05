export function CodePreview() {
  return (
    <div className="overflow-hidden rounded-xl bg-[#1E1E2E] shadow-lg">
      {/* Window Controls + File Tab */}
      <div className="flex items-center gap-3 border-b border-white/5 bg-[#181825] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#F38BA8]" />
          <div className="h-3 w-3 rounded-full bg-[#F9E2AF]" />
          <div className="h-3 w-3 rounded-full bg-[#A6E3A1]" />
        </div>
        <span className="font-mono text-xs text-white/40">hello_world.cpp</span>
      </div>

      {/* Code Content */}
      <div className="overflow-x-auto p-5 font-mono text-[13px] leading-6">
        <pre className="text-white/90">
          <code>
            <span className="text-[#CBA6F7]">#include</span>{' '}
            <span className="text-[#A6E3A1]">&lt;iostream&gt;</span>
            {'\n'}
            {'\n'}
            <span className="text-[#CBA6F7]">int</span>{' '}
            <span className="text-[#89B4FA]">main</span>
            <span className="text-white/60">() {'{'}</span>
            {'\n'}
            {'    '}
            <span className="text-[#F5C2E7]">std</span>
            <span className="text-white/60">::</span>
            <span className="text-[#89B4FA]">cout</span>{' '}
            <span className="text-[#89DCEB]">&lt;&lt;</span>{' '}
            <span className="text-[#A6E3A1]">&quot;Hello, World!&quot;</span>{' '}
            <span className="text-[#89DCEB]">&lt;&lt;</span>{' '}
            <span className="text-[#F5C2E7]">std</span>
            <span className="text-white/60">::</span>
            <span className="text-[#89B4FA]">endl</span>
            <span className="text-white/60">;</span>
            {'\n'}
            {'    '}
            <span className="text-[#CBA6F7]">return</span>{' '}
            <span className="text-[#FAB387]">0</span>
            <span className="text-white/60">;</span>
            {'\n'}
            <span className="text-white/60">{'}'}</span>
          </code>
        </pre>
      </div>
    </div>
  );
}
