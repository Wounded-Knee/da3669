// @ts-nocheck
import sift from 'sift';

sift.aggregate = function (command, arr) {
  let i,
    n,
    c,
    id,
    key,
    project,
    group,
    limit,
    skip,
    sort,
    unwind,
    id_arr,
    group_arr,
    unwind_arr,
    mapped,
    command_item,
    arr_item;

  if (!Array.isArray(command)) {
    command = [command];
  }
  for (c = 0; c < command.length; c += 1) {
    command_item = command[c];
    if (command_item.$match) {
      // MATCH
      arr = sift(command_item.$match, arr);
    } else if (command_item.$project) {
      // PROJECT
      project = command_item.$project;
      for (n = 0; n < arr.length; n += 1) {
        arr[n] = sift.mapObject(project, arr[n]);
      }
    } else if (command_item.$limit) {
      // LIMIT
      limit = command_item.$limit;
      arr = arr.slice(0, limit);
    } else if (command_item.$skip) {
      // SKIP
      skip = command_item.$skip;
      arr = arr.slice(skip);
    } else if (command_item.$group) {
      // GROUP
      group = command_item.$group;
      id_arr = [];
      group_arr = [];
      for (n = 0; n < arr.length; n += 1) {
        arr_item = arr[n];
        mapped = sift.mapObject(group, arr_item);
        id = JSON.stringify(mapped._id);
        i = id_arr.indexOf(id);
        if (i === -1) {
          i = id_arr.push(id) - 1;
          group_arr[i] = { _id: mapped._id };
        }
        delete mapped._id;
        for (key in mapped) {
          if (mapped.hasOwnProperty(key)) {
            if (mapped[key].$sum) {
              group_arr[i][key] = group_arr[i][key] || 0;
              group_arr[i][key] += mapped[key].$sum;
            } else if (mapped[key].$first) {
              if (group_arr[i][key] === undefined) {
                group_arr[i][key] = mapped[key].$first;
              }
            } else if (mapped[key].$last) {
              group_arr[i][key] = mapped[key].$last;
            } else if (mapped[key].$max) {
              if (!(group_arr[i][key] > mapped[key].$max)) {
                group_arr[i][key] = mapped[key].$max;
              }
            } else if (mapped[key].$min) {
              if (!(group_arr[i][key] < mapped[key].$min)) {
                group_arr[i][key] = mapped[key].$min;
              }
            } else if (mapped[key].$addToSet) {
              group_arr[i][key] = group_arr[i][key] || [];
              if (group_arr[i][key].indexOf(mapped[key].$addToSet) === -1) {
                group_arr[i][key].push(mapped[key].$addToSet);
              }
            } else if (mapped[key].$push) {
              group_arr[i][key] = group_arr[i][key] || [];
              group_arr[i][key].push(mapped[key].$push);
            } else if (mapped[key].$avg) {
              group_arr[i][key] = group_arr[i][key] || { _avg: 1, _count: 0, _sum: 0 };
              group_arr[i][key]._count += 1;
              group_arr[i][key]._sum += mapped[key].$avg;
            }
          }
        }
      }
      for (n = 0; n < group_arr.length; n += 1) {
        for (key in group_arr[n]) {
          if (group_arr[n].hasOwnProperty(key)) {
            if (group_arr[n][key]._avg) {
              group_arr[n][key] = group_arr[n][key]._sum / group_arr[n][key]._count;
            }
          }
        }
      }
      arr = group_arr;
    } else if (command_item.$sort) {
      // SORT
      sort = command_item.$sort;
      arr.sort(function (a, b) {
        let key;

        for (key in sort) {
          if (sort.hasOwnProperty(key)) {
            if (a[key] > b[key]) {
              return sort[key];
            }
            if (a[key] < b[key]) {
              return -sort[key];
            }
          }
        }
        return 0;
      });
    } else if (command_item.$unwind) {
      // UNWIND
      unwind = command_item.$unwind;
      unwind_arr = [];
      for (n = 0; n < arr.length; n += 1) {
        arr_item = arr[n];
        mapped = sift.mapObject(unwind, arr_item);
        if (_.isArray(mapped)) {
          for (i = 0; i < mapped.length; i += 1) {
            sift.propByString(arr_item, unwind.substr(1), mapped[i]);
            unwind_arr.push(red.cloneObject(arr_item));
          }
        } else {
          unwind_arr.push(arr_item);
        }
      }
      arr = unwind_arr;
    }
  }
  return arr;
};

export { sift };
