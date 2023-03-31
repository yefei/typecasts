const typeCastMap = {
  number(value: any) {
    const out = Number(value);
    if (!isNaN(out)) return out;
  },
  int(value: any) {
    const out = parseInt(value);
    if (!isNaN(out)) return out;
  },
  float(value: any) {
    const out = parseFloat(value);
    if (!isNaN(out)) return out;
  },
  bool(value: any) {
    const v = typeCastMap.trim(value);
    if (!v) return false;
    return ['y', '1', 'yes', 'on', 'true'].indexOf(v.toLowerCase()) !== -1;
  },
  trim(value: any) {
    if (typeof value === 'string') return value.trim();
    return typeCastMap.string(value);
  },
  /** 清理两端空白字符，且清理完的结果不能为空字符串 */
  trim2(value: any) {
    const out = typeCastMap.string(value);
    if (out && out.trim()) return out.trim();
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
};

export default typeCastMap;
