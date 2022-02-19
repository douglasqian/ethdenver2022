import {remove} from './ruleSlice';
import { useDispatch } from 'react-redux';
import styles from './styles/Master.module.scss'

const Rule = ({id, tokenContractAddr}) => {

  const dispatch = useDispatch()

  return (
      <div className={styles.rules}>
        Token contract address: {tokenContractAddr}
        <button onClick={() => dispatch(remove(id))}>X</button>
      </div>
    )
  }
  
export default Rule