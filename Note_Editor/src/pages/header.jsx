import Papa from 'papaparse';

export const handleDownloadChart = ({ chartOffest, startLand, csvData }) => {
    const offsetMs = Number(chartOffest) || 0;
    const rows = [
      [offsetMs],
      [Number(startLand) || 0],
      ...csvData.map((item) => {
        if (item.type === 'note') {
          return ['note', Math.round(Number(item.time) - offsetMs), Math.round(Number(item.land))];
        }
        if (item.type === 'drag') {
          return [
            'drag',
            Math.round(Number(item.timeStart) - offsetMs),
            Math.round(Number(item.timeEnd) - offsetMs),
            Math.round(Number(item.landStart)),
            Math.round(Number(item.landEnd)),
            Number(item.direction) || 0,
          ];
        }
        if (item.type === 'rotate') {
          return ['rotate', Math.round(Number(item.time) - offsetMs), Number(item.direction) || 0];
        }
        return null;
      }).filter(Boolean),
    ];
    const csv = Papa.unparse(rows);
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'base.csv';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
  };
