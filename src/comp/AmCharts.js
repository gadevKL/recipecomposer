import React, { Component } from 'react';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { Card, Col, Button, Modal } from 'react-bootstrap';
import moment from 'moment';
import { db } from '../firebase/config';

am4core.useTheme(am4themes_animated);

class AmChart extends Component {

    constructor() {
        super();
        this.state = { hour: 0, minute: 0, show: false, pie: "Please Input Number", input: 0, duration: 0, mf: 0 };
        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePie = this.handlePie.bind(this);
        this.handleDur = this.handleDur.bind(this);

    }

    componentDidMount() {
        let chart = am4core.create("chartdiv", am4charts.XYChart);
        chart.responsive.enabled = true;

        // let today = moment(this.props.date).format("YYYY-MM-DD")
        let today = this.momentConv(this.props.date)
        console.log(today)
        db.collection('pizem').doc(today).get().then(snap => {
            let arr = snap.data().data
            arr.forEach(function (item) {
                item.timestamp = new Date(item.timestamp.seconds * 1000)
            });
            arr.pop();
            arr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            chart.data = arr

            let grad = []
            var status = false;
            if (arr[0].power > 69.99) {
                grad.push({
                    "delta": arr[0].power,
                    "timestamp": arr[0].timestamp
                })
                status = true
            }
            for (let i = 1; i < arr.length - 1; i++) {
                if (arr[i].power > 69.9 && status === false) {
                    grad.push({
                        "power": arr[i].power,
                        "timestamp": arr[i].timestamp
                    })
                    status = true
                }
                else if (arr[i].power < 69.9 && status === true) {
                    status = false
                    grad.push({
                        "power": arr[i].power,
                        "timestamp": arr[i].timestamp
                    })
                }
                else {
                    continue
                }
            }

            var sum = 0;
            // if (grad.length !== 1) {
            //     for (let i = 0; i < grad.length; i = i + 2) {
            //         this.createRange(grad[i].timestamp, grad[i + 1].timestamp)
            //         sum += Math.abs(grad[i].timestamp - grad[i + 1].timestamp)
            //     }
            // }
            var toki = sum / 3600000;
            var mins = 60 * (toki - Math.floor(toki));
            this.setState({ hour: Math.floor(toki), minute: parseInt(mins) })
            this.setState({ pie: "Please Input Number", mf: (parseInt(mins) + 60 * Math.floor(toki)) })


            return arr
        });

        var unsub = db.collection('pizem').doc(today).onSnapshot(snap => {
            let arr = snap.data().data
            let len = arr.length
            let last = arr[len - 1]
            last.timestamp = new Date(last.timestamp.seconds * 1000);
            chart.addData(last)
            // console.log(arr)
            chart.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        });

        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.baseInterval = {
            "timeUnit": "second",
            "count": 5
        }
        dateAxis.dateFormats.setKey("hour", "[/][font-weight:500]hh:mm[/] [/][font-size:12px]a[/]");
        dateAxis.skipEmptyPeriods = false;
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.labels.template.location = 0.5;
        dateAxis.renderer.minGridDistance = 120;
        dateAxis.title.fontWeight = 500;
        dateAxis.periodChangeDateFormats.setKey("hour", "[/][font-weight:500]hh:mm[/] [/][font-size:12px]a[/]");

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.tooltip.disabled = false;
        valueAxis.renderer.minWidth = 35;

        let series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.dateX = "timestamp";
        series.dataFields.valueY = "power";
        // series.tooltipText = "{valueY.power}";yyyy-MMM-dd 
        series.tooltipText = "[/][#fff font-size: 18px font-weight:600 ]{power} W[/] [/][#fff font-size: 14px] \n {timestamp.formatDate('hh:mm a')}[/]";
        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;

        let range = valueAxis.axisRanges.create();
        range.value = 33;
        range.endValue = 69.6;
        range.axisFill.fill = chart.colors.getIndex(7);
        range.axisFill.fillOpacity = 0.2;
        // range.label.text = "Idle Power Draw";
        // range.label.inside = true;
        // range.label.location = 0.1
        this.unsub = unsub;
        this.chart = chart;
        this.dateAxis = dateAxis;
        this.valueAxis = valueAxis;
    }

    createRange(from, to) {
        let range = this.dateAxis.axisRanges.create();
        range.date = from;
        range.endDate = to;
        // range.label.text = "Operating";
        range.axisFill.fill = am4core.color('#47F05E');
        range.axisFill.fillOpacity = 0.2;
        // range.label.inside = true;
        // range.label.truncate = true;
        // range.label.location = 0.1
    }

    componentWillUnmount() {
        if (this.chart) {
            this.chart.dispose();
        }
    }

    componentDidUpdate(oldProps) {
        // var today = moment().format("YYYY-MM-DD")
        // var prevDate = moment(oldProps.date).format("YYYY-MM-DD")
        // var currentDate = moment(this.props.date).format("YYYY-MM-DD")

        var today = this.momentConv(new Date())
        var prevDate = this.momentConv(oldProps.date)
        var currentDate = this.momentConv(this.props.date)

        if (currentDate !== prevDate) {
            if (today === currentDate) {
                //SWAP BACK TO TODAY WITH SNAPSHOT
                this.unsub()
                // console.log("unsubbed first")

                db.collection('pizem').doc(today).get().then(snap => {
                    let arr = snap.data().data
                    arr.forEach(function (item) {
                        item.timestamp = new Date(item.timestamp.seconds * 1000)
                    });
                    arr.pop();
                    arr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    this.chart.data = arr

                    let grad = []
                    var status = false;

                    if (arr[0].power > 69.99) {
                        grad.push({
                            "delta": arr[0].power,
                            "timestamp": arr[0].timestamp
                        })
                        status = true
                    }

                    for (let i = 1; i < arr.length - 1; i++) {
                        if (arr[i].power > 69.9 && status === false) {
                            grad.push({
                                "power": arr[i].power,
                                "timestamp": arr[i].timestamp
                            })
                            status = true
                        }
                        else if (arr[i].power < 69.9 && status === true) {
                            status = false
                            grad.push({
                                "power": arr[i].power,
                                "timestamp": arr[i].timestamp
                            })
                        }
                        else {
                            continue
                        }
                    }

                    var sum = 0;
                    if (grad.length !== 1) {
                        for (let i = 0; i < grad.length; i = i + 2) {
                            this.createRange(grad[i].timestamp, grad[i + 1].timestamp)
                            sum += Math.abs(grad[i].timestamp - grad[i + 1].timestamp)
                        }
                    }
                    var toki = sum / 3600000;
                    var mins = 60 * (toki - Math.floor(toki));
                    this.setState({ hour: Math.floor(toki), minute: parseInt(mins) })
                    this.setState({ pie: "Please Input Number", mf: (parseInt(mins) + 60 * Math.floor(toki)) })

                    return arr
                });

                var unsub = db.collection('pizem').doc(today).onSnapshot(snap => {
                    let arr = snap.data().data
                    let len = arr.length
                    let last = arr[len - 1]
                    // console.log(arr)
                    // console.log("subbed again on first")
                    last.timestamp = new Date(last.timestamp.seconds * 1000);
                    this.chart.addData(last)
                    this.chart.data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                });

                this.unsub = unsub;
                this.chart.validateData();

            }
            //HISTORY DATA ONLY NO SNAPSHOTS
            else {

                this.unsub();
                // console.log("unsubbed second")

                db.collection('pizem').doc(currentDate).get().then(snap => {

                    let arr = snap.data().data
                    arr.forEach(function (item) {
                        item.timestamp = new Date(item.timestamp.seconds * 1000)
                    });
                    arr.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    this.chart.data = arr
                    // console.log(arr)
                    let grad = []
                    var status = false;

                    if (arr[0].power > 69.9) {
                        grad.push({
                            "delta": arr[0].power,
                            "timestamp": arr[0].timestamp
                        })
                        status = true
                    }

                    for (let i = 1; i < arr.length - 1; i++) {
                        if (arr[i].power > 69.9 && status === false) {
                            grad.push({
                                "power": arr[i].power,
                                "timestamp": arr[i].timestamp
                            })
                            status = true
                        }
                        else if (arr[i].power < 69.9 && status === true) {
                            status = false
                            grad.push({
                                "power": arr[i].power,
                                "timestamp": arr[i].timestamp
                            })
                        }
                        else {
                            continue
                        }
                    }

                    var sum = 0;
                    if (grad.length !== 1) {
                        for (let i = 0; i < grad.length; i = i + 2) {
                            this.createRange(grad[i].timestamp, grad[i + 1].timestamp)
                            sum += Math.abs(grad[i].timestamp - grad[i + 1].timestamp)
                        }
                    }
                    var toki = sum / 3600000;
                    var mins = 60 * (toki - Math.floor(toki));
                    this.setState({ hour: Math.floor(toki), minute: parseInt(mins) })
                    this.setState({ pie: "Please Input Number", mf: (parseInt(mins) + 60 * Math.floor(toki)) })

                    // console.log(toki)

                    return arr
                });
                this.chart.validateData();
            }
        }

    }

    handleClose() {
        this.setState({ show: false })
    }

    handleShow() {
        this.setState({ show: true })
    }

    handleChange(e) {
        this.setState({ input: e.target.value });
    }

    handleDur(e) {
        this.setState({ duration: e.target.value });
    }

    handlePie() {
        var disp = this.state.input / this.state.duration
        // (this.state.hour + this.state.minute / 60)
        var comb = "Output : " + parseInt(disp * 60) + " pies / hour"
        this.setState({ pie: comb })
        this.setState({ show: false })
        // if ((this.state.hour + this.state.minute / 60)==0) {
        //     console.log('MACHINE DID NOT RUN TODAY')
        //     this.setState({ pie: "No detected operating time" })
        //     this.setState({ show: false })

        // } else {
        //     this.setState({ pie: comb })
        //     this.setState({ show: false })
        // }
    }

    momentConv(d) {
        let riqi = d.getDate()
        riqi = riqi > 9 ? riqi : "0" + riqi;
        let yue = d.getMonth() + 1
        yue = yue > 9 ? yue : "0" + yue;
        return d.getFullYear() + '-' + yue + '-' + riqi;
    }

    render() {
        return (
            <Col sm={12}>
                <Card className="my-2 mx-auto mb-3">
                    <div className="card-body" >
                        {/* <h5 className="card-title">Live Power Draw</h5>
                        <small className="d-inline-block align-top mr-3">🟢  Machine Operating</small>
                        <small className="d-inline-block align-top mr-4">🔴  Idle Power Draw (45 W - 69 W) </small>
                        <small className="d-inline-block align-top mr-4">
                            🕒  Total Machine Operation Time : {this.state.hour} hrs {this.state.minute} min ({this.state.mf} mins)
                        </small> */}
                        {/* <small className="d-inline-block align-top" size="sm" variant="primary" onClick={this.handleShow}>
                            ⏲️ {this.state.pie}
                        </small> */}
                        <div id="chartdiv" style={{ width: "100%", height: "500px" }}></div>
                    </div>
                </Card>

                <Modal centered show={this.state.show} onHide={this.handleClose} animation={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Pie Output Calculator</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <input type="text" placeholder="Number of pies?" onChange={this.handleChange} />
                        <input type="text" placeholder="Duration (mins)" onChange={this.handleDur} />

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handlePie}>Submit</Button>
                    </Modal.Footer>
                </Modal>

            </Col>
        );
    }
}

export default AmChart;