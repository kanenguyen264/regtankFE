import tableActions from "../actions/ProfileTableAction";

export const processTableData = (state, itemUpdate) => {
  let dataTemp = state;
  if (dataTemp) {
    if (dataTemp.length === 0) {
      dataTemp.push(itemUpdate);
      return dataTemp;
    } else {
        // update một số field change nếu cùng id
      dataTemp.map((item, index) => {
        if (item.id === itemUpdate.id) {
          dataTemp[index] = { ...item, ...itemUpdate };
          return dataTemp;
        }
      });

      // kiểm tra nếu itemUpdate ko tồn tại trong dataTemp thì push vào.
      let count = 0;
      dataTemp.map((item, index) => {
        if (item.id === itemUpdate.id) {
          count= count + 1;
        }
      });
      if(count===0) {
        dataTemp.push(itemUpdate)
      }
      return state;
    }
  }
};

const initialState = {
  dataTable: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case tableActions.CHAGE_FIELD_REQUEST:
      return {
        ...state,
      };
    case tableActions.CHAGE_FIELD_SUCCESS:
      const itemUpdate = action.fields;
      const data = state.dataTable;
      const dataResult = processTableData(data, itemUpdate);
      return {
        ...state,
        dataTable: dataResult,
      };

    default:
      return state;
  }
};
