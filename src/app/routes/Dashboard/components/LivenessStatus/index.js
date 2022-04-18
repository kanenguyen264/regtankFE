import IntlMessages from "@protego/sdk/UI/IntlMessages";
import * as React from "react";
import styles from "../../Dashboard.module.scss";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatusChart } from "../../../../../actions";
import { REPORT_DAYS } from "../../../../../constants/Dashboard";
import { useEffect } from "react";
import Button from "@material-ui/core/Button";
import { Pie } from "react-chartjs-2";

const BUTTONS = [
  {
    label: "1W",
    type: REPORT_DAYS.ONE_WEEK,
  },
  {
    label: "1M",
    type: REPORT_DAYS.ONE_MONTH,
  },
  {
    label: "3M",
    type: REPORT_DAYS.THREE_MONTH,
  },
  {
    label: "6M",
    type: REPORT_DAYS.SIX_MONTH,
  },
  {
    label: "1Y",
    type: REPORT_DAYS.ONE_YEAR,
  },
];

const pieOptions = {
  plugins: {
    labels: [
      {
        render: function (args) {
          return `${args.value} (${args.percentage}%)`;
        },
        fontColor: ["green", "white", "red"],
        precision: 0,
      },
    ],
  },
};

const LivenessStatus = () => {
  const dispatch = useDispatch();
  const { statusReport } = useSelector((state) => state.dashboard);
  const [reportDay, setReportDay] = React.useState(REPORT_DAYS.ONE_WEEK);

  const loadData = (type) => {
    setReportDay(type);
    dispatch(fetchStatusChart({ type }));
  };

  const chartData = () => {
    const report = statusReport.data || {};

    return {
      labels: report.approveMode
        ? ["Processing", "Approved", "Rejected", "Expired"]
        : ["Processing", "Passed", "Failed", "Expired"],
      datasets: [
        {
          label: "# of status",
          data: report.approveMode
            ? [
                report.totalProccessing,
                report.totalApproved,
                report.totalRejected,
                report.totalExpired,
              ]
            : [
                report.totalProccessing,
                report.totalPassed,
                report.totalFailed,
                report.totalExpired,
              ],
          backgroundColor: [
            "rgba(177, 248, 242, 0.8)",
            "rgba(188, 211, 156, 0.8)",
            "rgba(255, 252, 153, 0.8)",
            "rgba(234, 253, 207, 0.8)",
            "rgba(188, 192, 148, 0.8)",
            "rgba(165, 162, 118, 0.8)",
          ],
          borderColor: [
            "rgba(177, 248, 242, 1)",
            "rgba(188, 211, 156, 1)",
            "rgba(255, 252, 153, 1)",
            "rgba(234, 253, 207, 1)",
            "rgba(188, 192, 148, 1)",
            "rgba(165, 162, 118, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  useEffect(() => {
    loadData(REPORT_DAYS.ONE_WEEK);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card className={styles.root}>
      <CardContent>
        <h2>
          <div className={styles.actionsReport}>
            {BUTTONS.map((item) => (
              <Button
                color={reportDay === item.type ? "primary" : ""}
                onClick={(e) => loadData(item.type)}
              >
                {item.label}
              </Button>
            ))}
          </div>
          <IntlMessages id="dashboard.liveness_status_chart" />
        </h2>
        <Pie data={chartData()} options={pieOptions} />
      </CardContent>
    </Card>
  );
};

export default LivenessStatus;
