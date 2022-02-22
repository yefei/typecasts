export default {
  /**
   * 小于 <
   */
  lt(target: any) {
    return (value: any) => value < target;
  },

  /**
   * 小于等于 <=
   */
  lte(target: any) {
    return (value: any) => value <= target;
  },

  /**
   * 大于 >
   */
  gt(target: any) {
    return (value: any) => value > target;
  },

  /**
   * 大于等于 >=
   */
  gte(target: any) {
    return (value: any) => value >= target;
  },

  /**
   * 等于 ==
   */
  eq(target: any) {
    return (value: any) => value == target;
  },

  /**
   * 不等于 !=
   */
  neq(target: any) {
    return (value: any) => value != target;
  },

  /**
   * 最大长度，调用值的 .length 属性
   */
  maxLength(len: number) {
    return (value: any) => value.length <= len;
  },

  /**
   * 最小长度，调用值的 .length 属性
   */
  minLength(len: number) {
    return (value: any) => value.length >= len;
  },

  /**
   * 只能出现的值
   */
  in(array: any[]) {
    return (value: any) => array.indexOf(value) >= 0;
  },

  /**
   * 不能出现的值
   */
  notIn(array: any[]) {
    return (value: any) => array.indexOf(value) == -1;
  },

  /**
   * 正则表达式匹配
   */
  regexp(pattern: string | RegExp) {
    return (value: any) => {
      if (typeof pattern === 'string') {
        pattern = new RegExp(pattern);
      }
      return pattern.test(value);
    };
  },

  /**
   * 是否满足Email地址规则
   */
  email(is = true) {
    return (value: any) => /^\S+@\S+\.\S+$/.test(value) === is;
  },

  /**
   * 是否满足URL路径规则
   */
  slug(is = true) {
    return (value: any) => /^[^\s-_](?!.*?[-_]{2,})[a-z0-9-\\][^\s]*[^-_\s]$/i.test(value) === is;
  },

  /**
   * 是否满足 URL 规则
   * @param protocols 如果为 boolean 则默认支持 http https 协议
   */
  url(protocols: string[] | boolean) {
    return (value: any) => {
      let is = true;
      if (typeof protocols === 'boolean') {
        is = protocols;
        protocols = ['http', 'https'];
      }
      const [_protocol, _addr] = value.split('://', 2);
      if (_protocol && _addr && protocols.indexOf(_protocol.toLowerCase()) > -1)
        return /^([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/.test(_addr) === is;
      return !is;
    };
  },
};
