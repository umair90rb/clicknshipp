export default (name) => {
  const split_name = name.split(" ");
  if (split_name.length === 1)
    return { first_name: split_name[0], last_name: null };
  if (split_name.length === 2)
    return { first_name: split_name[0], last_name: split_name[1] };
  if (split_name.length > 2)
    return {
      first_name: `${split_name[0]} ${split_name[1]}`,
      last_name: `${split_name.slice(2).join(" ")}`,
    };
};
