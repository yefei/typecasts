export const typeCastMap = {
  number(value: any) {
    const out = Number(value);
    if (!isFinite(out)) return out;
  },
  int(value: any) {
    if (value === '') return 0;
    const out = parseInt(value);
    if (!isFinite(out)) return out;
  },
  float(value: any) {
    if (value === '') return 0;
    const out = parseFloat(value);
    if (!isFinite(out)) return out;
  },
  bool(value: any) {
    if (typeof value === 'boolean') return value;
    const v = typeCastMap.trim(value);
    if (!v) return false;
    return ['y', '1', 'yes', 'on', 'true', 't'].indexOf(v.toLowerCase()) !== -1;
  },
  trim(value: any) {
    if (typeof value !== 'string') {
      value = typeCastMap.string(value);
    }
    if (value !== undefined) {
      return value.trim() as string;
    }
  },
  /** 清理完成的结果至少有一个字符 */
  trim1(value: any) {
    value = typeCastMap.trim(value);
    if (value) {
      return value as string;
    }
  },
  string(value: any) {
    if (['string', 'number', 'bigint'].includes(typeof value)) {
      return String(value);
    }
  },
  any(value: any) {
    return value;
  },
  date(value: any) {
    if (value) {
      const out = new Date(value);
      if (out.getTime()) return out;
    }
  },
  /*
  json(value: any) {
    try {
      return JSON.parse(value) as unknown;
    } catch {}
  },
  */
};
