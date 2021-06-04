import C from '../../actions/constants';

 const reducer = (state = {}, action) => {

    function compare( a, b ) {
        if ( a.value < b.value ){
          return 1;
        }
        if ( a.value > b.value ){
          return -1;
        }
        return 0;
      }
      
      
    switch (action.type) {
        
        case C.DASHBOARD_DATASETS:
            return action.payload.data.sort( compare );

        default:
            return state;
    }
}

export default reducer;