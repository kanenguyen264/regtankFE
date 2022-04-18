import IntlMessages from "@protego/sdk/UI/IntlMessages";
import * as React from "react";
import styles from "../../Dashboard.module.scss";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchPercentageChart } from "../../../../../actions";
import { REPORT_DAYS } from "../../../../../constants/Dashboard";
import { useEffect } from "react";
import Button from "@material-ui/core/Button";
import { Bar } from "react-chartjs-2";

const BUTTONS = [
  {
    label: '1W',
    type: REPORT_DAYS.ONE_WEEK
  },
  {
    label: '1M',
    type: REPORT_DAYS.ONE_MONTH
  },
  {
    label: '3M',
    type: REPORT_DAYS.THREE_MONTH
  },
  {
    label: '6M',
    type: REPORT_DAYS.SIX_MONTH
  },
  {
    label: '1Y',
    type: REPORT_DAYS.ONE_YEAR
  }
]

const barOptions = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
  plugins: {
    labels: [
      {
        render: "value",
        fontColor: ['green', 'white', 'red'],
        precision: 0
      }
    ]
  }
};

const AveragePercentage = () => {
  const dispatch = useDispatch();
  const { percentageReport } = useSelector((state) => state.dashboard);
  const [reportDay, setReportDay] = React.useState(REPORT_DAYS.ONE_WEEK);

  const loadData = (type) => {
    setReportDay(type);
    dispatch(
      fetchPercentageChart({ type })
    );
  }

  const chartData = () => {
    const report = percentageReport.data || {}
    return {
      labels: ['0-10%', '11%-20%', '21%-30%', '31%-40%', '41%-50%', '51%-60%', '61%-70%', '71%-80%', '81%-90%', '91%-100%'],
      datasets: [
        {
          label: '# of status',
          data: [
            report.total0To10,
            report.total11To20,
            report.total21To30,
            report.total31To40,
            report.total41To50,
            report.total51To60,
            report.total61To70,
            report.total71To80,
            report.total81To90,
            report.total91To100,
          ],
          backgroundColor: [
            'rgba(177, 248, 242, 0.8)',
            'rgba(188, 211, 156, 0.8)',
            'rgba(255, 252, 153, 0.8)',
            'rgba(234, 253, 207, 0.8)',
            'rgba(188, 192, 148, 0.8)',
            'rgba(165, 162, 118, 0.8)',
            'rgba(142, 131, 88, 0.7)',
            'rgba(152, 142, 103, 0.6)',
            'rgba(161, 152, 117, 0.5)',
            'rgba(170, 161, 130, 0.4)',
          ],
          borderColor: [
            'rgba(177, 248, 242, 1)',
            'rgba(188, 211, 156, 1)',
            'rgba(255, 252, 153, 1)',
            'rgba(234, 253, 207, 1)',
            'rgba(188, 192, 148, 1)',
            'rgba(165, 162, 118, 1)',
            'rgba(142, 131, 88, 1)',
            'rgba(152, 142, 103, 1)',
            'rgba(161, 152, 117, 1)',
            'rgba(170, 161, 130, 1)',

          ],
          borderWidth: 1,
        },
      ],
    };
  }

  useEffect(() => {
    loadData(REPORT_DAYS.ONE_WEEK);
  }, []);

  return (
    <Card className={styles.root}>
      <CardContent>
        <h2>
          <div className={styles.actionsReport}>
            {BUTTONS.map(item => <Button color={reportDay === item.type ? 'primary' : ''} onClick={e=>loadData(item.type)}>{item.label}</Button>)}
          </div>
          <IntlMessages id="dashboard.average_percentage"/>
        </h2>
        <Bar data={chartData()} options={barOptions} />
      </CardContent>
    </Card>
  )
};

export default AveragePercentage;
