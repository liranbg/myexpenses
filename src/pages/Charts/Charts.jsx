import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import { Bar } from 'react-chartjs-2';

export class ChartsPage extends Component {
  componentWillMount() {}

  render() {
    return (
      <Container>
        <Bar
          data={{
            labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
            datasets: [
              {
                label: '# of Votes',
                data: Array.from({ length: 6 }, () =>
                  Math.floor(Math.random() * 20)
                ),
                borderWidth: 1
              }
            ]
          }}
          options={{
            scales: {
              yAxes: [
                {
                  ticks: {
                    beginAtZero: true
                  }
                }
              ]
            }
          }}
        />
      </Container>
    );
  }
}
