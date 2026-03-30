export function filesize(size: number) {
    const i = Math.floor(Math.log(size) / Math.log(1024));
    const idx = Math.min(i, 4);
    return (
        Number((size / Math.pow(1024, idx)).toFixed(2)) +
        ' ' +
        ['B', 'kB', 'MB', 'GB', 'TB'][idx]
    );
}