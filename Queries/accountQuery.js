import gql from '../node_modules/graphql-tag';

export default gql`
query GetPost{
  getMC2BankA(account_id: "xxxxxxx"){
    __typename
    account_id
    balance
    f_balance
    t_balance
  }
}`;
