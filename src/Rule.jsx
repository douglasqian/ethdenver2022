import {remove} from './ruleSlice';
import { useDispatch } from 'react-redux';

const Rule = ({id, tokenContractAddr}) => {

  const dispatch = useDispatch()

  return (
      <div>
        Token contract address: {tokenContractAddr}
        <button onClick={() => dispatch(remove(id))}>X</button>
      </div>
    )
  }
  
export default Rule