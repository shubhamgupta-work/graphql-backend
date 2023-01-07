exports.sortArgsHelper = (sort) => {
  let sortArgs = {
    sortBy: "_id",
    order: "asc",
    limit: 10,
    skip: 0,
  };

  for (let key in sort) {
    if (sort[key]) {
      sortArgs[key] = sort[key];
    }
  }

  return sortArgs;
};
