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
  /** 去除字符串两端的空白字符，如果结果为空字符串则抛弃 */
  trim(value:any): string {
    const v = string(value);
    if (v !== undefined && v.trim()) {
      return v.trim();
    }
  },
  string,
  any(value:any) {
    return value;
  },
  date(value:any): Date {
    if (value) {
      value = new Date(value);
      if (value.getTime()) return value;
    }
  },
};
