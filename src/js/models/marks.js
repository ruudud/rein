import marks from '../db/marks';

function findMarks(s) {
  const needle = s.toLowerCase().trim();
  return marks.filter(m => {
    return (m.firstName + m.lastName).toLowerCase().indexOf(needle) > -1;
  });
}

export default {
  namespace: 'marks',
  state: { items: [] },
  reducers: {
    find: (data, state) => ({ items: findMarks(data) })
  }
};
