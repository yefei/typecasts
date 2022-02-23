function string(value:any) {
  if (['string', 'number', 'bigint'].includes(typeof value)) {
    return String(value);
  }
}

export default {
  number(value:any): number {
    value = Number(value);
    if (!isNaN(value)) return value;
  },
  int(value:any): number {
    value = parseInt(value);
    if (!isNaN(value)) return value;
  },
  float(value:any): number {
    value = parseFloat(value);
    if (!isNaN(value)) return value;
  },
  bool(value:any): boolean {
    value = String(value).toLowerCase();
    return ['y', '1', 'yes', 'on', 'true'].indexOf(value) !== -1;
  },
  trim(value:any): string {
    const v = string(value);
    if (v) return v.trim();
  },
  string,
  origin(value:any) {
    return value;
  },
  date(value:any): Date {
    if (value) {
      value = new Date(value);
      if (value.getTime()) return value;
    }
  },
};
