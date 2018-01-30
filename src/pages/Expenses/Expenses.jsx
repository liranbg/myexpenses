import React, { Component } from 'react';
import { Header, Card, Container } from 'semantic-ui-react';
import { Expense } from '../../interfaces/interfaces';
import ExpenseCard from '../../components/Expense/Expense';
import { connect } from 'react-redux';

class ExpensesPage extends Component {
  render() {
    return (
      <Container>
        <Header size="huge">My Expenses</Header>
        <Card.Group itemsPerRow={3}>
          {this.props.expenses.map((expense: Expense, i) => (
            <ExpenseCard key={i} expense={expense} />
          ))}
        </Card.Group>
      </Container>
    );
  }
}

const mapStateToProps = state => ({ expenses: state.expenses });
ExpensesPage = connect(mapStateToProps)(ExpensesPage);
export default ExpensesPage;
