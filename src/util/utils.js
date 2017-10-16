export const getParams = query => {
  if (!query) {
    return { };
  }

  return (query
    .split('?')[1]
    .split('&')
    .reduce((params, param) => {
      let [ key, value ] = param.split('=');
      params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
      return params;
    }, { }));
};