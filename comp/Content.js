import React, { useState } from "react";
import { Row, Container } from 'react-bootstrap';
import AmChart from './AmCharts';
import Filling from './Filling.js';
// import { dbP } from '../firebase/config-prod';
// import moment from 'moment';

const Content = (props) => {

    // console.log(props.content)

    const [startDate, setStartDate] = useState(new Date());
    startDate.setHours(0, 0, 0, 0);
    // let date = "  " + startDate.toLocaleDateString('en-GB') + " "

    // const [show, setShow] = useState(false);
    // const handleClose = () => setShow(false);
    // const handleShow = () => setShow(true);
    // const [ev, setEv] = useState([])

    // const handleDate = (arg) => {
    //     var palette = ['#ff9f00', '#3c9ee5', '#4CC790', '#C70D58', '#7992f3', '#5f74da', '#a36ada', '#257c35', '#fc7e26', '#8b2691', '#940007']
    //     // console.log(Math.floor(Math.random() * (palette.length)))
    //     var events = [];
    //     dbP.collection("sl_report_record").where('start', '>', arg.start).where('start', '<', arg.end)
    //         .get().then((querySnapshot) => {
    //             if (!querySnapshot.empty) {
    //                 var docs = querySnapshot.docs.map(doc => doc.data());
    //                 // console.log(docs)product_code: "SML0248"
    //                 let preval1 = docs.filter(d => d.product_name.includes('PIE'))
    //                 let preval2 = preval1.filter(d => d.product_code !== "SML0262")
    //                 let valid = preval2.filter(d => d.product_code !== "SML0248")
    //                 // console.log(valid)
    //                 // var test = [];
    //                 if (valid.length > 0) {
    //                     valid.forEach(item => events.push({
    //                         title: item.product_name,
    //                         color: palette[Math.floor(Math.random() * (palette.length))],
    //                         resourceId: item.production_order,
    //                         start: moment(item.Actual_start, 'YYYY-MM-DD ').toDate(),
    //                         end: moment(item.Actual_end, 'YYYY-MM-DD ').toDate()
    //                     }))
    //                     setEv(events)
    //                     // valid.forEach(item => test.push(item.product_code))
    //                     // console.log(test)
    //                 }
    //             }
    //         }).catch(error => { console.log(error) });
    // }

    // const handleClick = (arg) => {
    //     setShow(false);
    //     setStartDate(arg.date);
    // }

    // const handleHover = (arg) => {
    //     console.log("PP/" + arg.event._def.extendedProps.resourceId +"\n"+arg.event._def.title)
    //     console.log(arg.jsEvent)
    //     let disp = "PP/" + arg.event._def.extendedProps.resourceId + "\n" + arg.event._def.title
    //     arg.el.setAttribute("data-tip", disp);
    //     console.log(arg.el)
    // }

    if (props.content === 'O') {
        return (
            <Container fluid>
                <Filling date={startDate} />
            </Container>
        );
    }
    else if (props.content === 'T') {
        return (
            <Container>
                <Row>
                    <AmChart date={startDate} />
                </Row>
            </Container>
        )
    }
    else {
        return (
            <div>
                under development 404
            </div>
        )
    }
};

export default Content