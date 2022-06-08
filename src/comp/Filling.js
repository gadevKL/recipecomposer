import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Modal, Button, Stack, OverlayTrigger, Tooltip, Card, ListGroup, Form, FloatingLabel } from 'react-bootstrap';
import { dbP } from '../firebase/config-prod';
import { db } from '../firebase/config';
// import Swal from 'sweetalert2'
// import moment from 'moment';

import UploadImages from "./ImageUpload";
// import useGetFilling from "../hooks/useGetListFilling";


const Filling = (props) => {
  const briefText = useRef(null);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [briefShow, setBriefShow] = useState(" ");



  const [selectValue, setSelectValue] = useState({ method: 'empty', img: false, brief: 'N/A', imgurl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREQUPJQLLUQw0yUfvStpxF1znoHWefJtbQRA&usqp=CAU' });
  // const { val, page } = useGetFilling(props);
  const [val, setVal] = useState([<ListGroup.Item key="NaN"> None </ListGroup.Item>]);
  const [page, setPage] = useState({ name: "No Recipe Selected" });

  const [formFields, setFormFields] = useState([
    {
      description: ' ',
      temperature: 0,
      duration: 0,
      step: 0,
    }
  ])

  const handleFormChange = (event, index) => {
    let data = [...formFields];
    data[index][event.target.name] = event.target.value;
    setFormFields(data);
  }

  const submit = (e) => {
    e.preventDefault();
    console.log(page.code)
    console.log(page.name)
    console.log(formFields)

    var method = {};

    //var arrMethod =[];

    for (let i = 0; i < formFields.length; i++) {
      // var key = {};
      var j = i + 1;
      // method['Step ' + parseInt(j)] = formFields[i];
      method['Step ' + parseInt(j)] = {
        description: formFields[i].description,
        step: parseInt(j + 1),
        temperature: formFields[i].temperature ? Number(formFields[i].temperature) : 0,
        duration: formFields[i].duration ? Number(formFields[i].duration) : 0
      }

      //arrMethod.push(key);
      //  method= key;
    }
    //console.log(arrMethod);
    console.log(method);

    db.collection("recipe_method").doc(page.code).set({
      filling_code: page.code,
      filling_name: page.name,
      method: method
    }, { merge: true });
    // setPage(page.filling_code)
    handleClose()

  }

  const addFields = () => {
    let object = {
      description: null,
      temperature: null,
      duration: null,
    }

    setFormFields([...formFields, object])
  }

  const removeFields = (index) => {
    let data = [...formFields];
    data.splice(index, 1)
    setFormFields(data)
  }

  const loadPrev = (code) => {
    handleShow();
    db.collection("recipe_method").doc(code).get().then((snapshot) => {
      // db.collection("recipe_method").doc(code).onSnapshot((snapshot) => {
      try {
        let sortArr = [];
        let data = snapshot.data().method
        // console.log(data)
        for (let key in data) {
          data[key]['step'] = Number(key.slice(5));
          sortArr.push(data[key]);
        }
        sortArr.sort((a, b) => a.step - b.step)
        setFormFields(sortArr)
        // console.log(sortArr)
      }
      catch {
        console.log('No document')
        setFormFields([{
          description: ' ',
          temperature: 0,
          duration: 0,
        }])
      }
    })
  }

  const refreshList = () => {
    dbP.collection("product_specs").get().then(snap => {
      if (snap) {
        var setJSON = {};
        snap.docs.forEach(item => {
          let data = item.data()

          if (item.id.slice(0, 3) === "HCK") {
            setJSON[data.product_code] = data.product_name
          }
        });
        // console.log(setJSON)
        db.collection("list").doc("hck").set(setJSON);
      }
    })
  }

  const handleNull = (input, dur) => {
    if (input < 1 || input === '0' || input === null) { return null }
    else { return (dur ? "Duration: " + input + " mins" : "Target Temperature: " + input + " °C") }
  }

  useEffect(() => {
    var final = [];
    // var deleJSON = {};
    const unsub = db.collection("list").doc("hck").onSnapshot(snap => {
      if (snap) {
        let data = snap.data()
        // console.log(data)

        Object.keys(data).forEach(key => {
          final.push(
            <ListGroup.Item action key={key}
              onClick={() => setPage({
                name: data[key],
                code: key
              })}>
              {data[key]}
            </ListGroup.Item>
          )
        })

        final.sort((a, b) => (Number(a.key.slice(3))) - (Number(b.key.slice(3))));
        // console.log(final)
        setVal(final);
        // console.log(deleJSON)
      }
      else {
        console.log('No match')
        // setPage('empty')
        setVal(
          <ListGroup.Item key="NaN" >
            No task
          </ListGroup.Item>
        )
      }
    })

    return () => { unsub(); };
  }, []);

  useEffect(() => {
    // console.log(page.filling_code + ' selected')
    // db.collection("recipe_method").doc(page.filling_code).get().then((snapshot) => {
    const unsub = db.collection("recipe_method").doc(page.code).onSnapshot((snapshot) => {

      try {
        let sortArr = [];
        let final = [];
        let data = snapshot.data().method

        for (let key in data) {
          data[key]['step'] = Number(key.slice(5));
          sortArr.push(data[key]);
        }
        sortArr.sort((a, b) => a.step - b.step)
        // console.log(sortArr)

        for (let i = 0; i < sortArr.length; i++) {
          final.push(
            <ListGroup.Item key={i}>
              <h6>Step {i + 1}</h6>
              <div>{sortArr[i].description}</div>
              <div className="text-muted">{handleNull(sortArr[i].duration, true)}</div>
              <div className="text-muted">{handleNull(sortArr[i].temperature, false)}</div>
              {/* <div className="text-muted">{sortArr[i].temperature ? "Temperature: " + sortArr[i].temperature + " °C" : null}  </div>

              <div className="text-muted">Target Temperature : {sortArr[i].temperature} °C</div> */}
            </ListGroup.Item>
          )
        }
        setSelectValue({
          method: final,
          img: (snapshot.data().img ? true : false),
          brief: snapshot.data().brief,
          imgurl: (snapshot.data().img ? snapshot.data().img : " ")
        })
      }
      catch {
        // console.log('No document')
        setSelectValue({ method: "Cannot Find Recipe", img: false, brief: null })
        setFormFields([{
          description: ' ',
          temperature: 0,
          duration: 0,
        }])
      }
    })
    // .catch((e) => console.log(e))
    return () => { unsub(); };

  }, [page]);

  const cardImage = (url) => {
    return (<div>
      <img
        alt='food cover'
        style={{ maxHeight: "25vh", objectFit: 'cover', borderRadius: '8px' }}
        src={url}
      />
    </div>)
  }

  const handleBrief = () => {
    console.log(briefText.current.value)

    db.collection("recipe_method").doc(page.code).set({
      brief: briefText.current.value
    }, { merge: true });
  }

  return (
    <div className="m-3">
      {/* <Stack direction="horizontal" gap={3}>
        <h4 className="mb-3">Recipe Composer</h4>
        <OverlayTrigger className="me-auto" placement="right"
          delay={{ show: 50, hide: 100 }}
          overlay={<Tooltip>Press F3 or Ctrl+F to Search </Tooltip>}>
          <Button size="sm" variant="pog" className="mb-2">🔍</Button>
        </OverlayTrigger>
      </Stack> */}

      <Row>
        <Col md={4}>
          <Card>
            <div className="text-center mt-1">
              <h5 className="pt-2 mx-2 d-inline-block">Filling List</h5>
              <OverlayTrigger className="me-auto" placement="right"
                delay={{ show: 50, hide: 100 }}
                overlay={<Tooltip>Press F3 or Ctrl+F to Search </Tooltip>}>
                <Button size="sm" variant="pog" className="mb-2">🔍</Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="right" delay={{ show: 50, hide: 100 }}
                overlay={<Tooltip>Refresh Filling List</Tooltip>}>
                <Button size="sm" variant="light" className="mb-1 d-inline-block"
                  onClick={refreshList}>↻</Button>
              </OverlayTrigger>

            </div>

            <Card.Body className="lg"><ListGroup variant="flush" >
              {val}
            </ListGroup></Card.Body>

          </Card>
        </Col>

        <Col md={8}>
          <Card >
            <Card.Header>
              <Stack direction="horizontal" gap={3}>
                <div className="text-muted">{page.code ? page.name : "Select Recipe"}</div>
                <Button className="px-3 ms-auto" size="sm" variant="success" onClick={() => { loadPrev(page.code) }}>
                  Edit Recipe
                </Button>
              </Stack>
            </Card.Header>

            <Card.Body className="lgh">
              <Stack direction="horizontal" gap={3}>
                {selectValue.img ? cardImage(selectValue.imgurl) : null}
                <div>
                  <h4>{page.name ? page.name : "  "}</h4>
                  <div className="text-muted pointHover" onClick={() => { setBriefShow(true) }}>
                    {selectValue.brief ? selectValue.brief : "No description available."}
                    <img className="mx-2 mb-1"
                      alt="edit"
                      width="16px"
                      height="16px"
                      src="https://pixtrest.herokuapp.com/assets/profile/pencil-80879edb0e6fa1d8a47fe98f52714e0e141be2aa4f2cca66280b5c18d12f4166.png"
                    />
                  </div>
                </div>
              </Stack>
              <hr />
              <ListGroup variant="flush" >
                {selectValue.method}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>



      <Modal animation={true}
        size="xl"
        show={show}
        onHide={handleClose} >
        <Modal.Header closeButton>
          <Modal.Title>{page.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <Button onClick={() => { console.log(formFields); }}></Button> */}
          <Form>
            {formFields.map((form, index) => {
              return (
                <div key={index}>
                  <Row>
                    <Stack direction="horizontal" gap={0} className="mt-1">
                      <h6 className="my-1">Step {index + 1} </h6>

                      <OverlayTrigger placement="right"
                        delay={{ show: 50, hide: 100 }}
                        overlay={<Tooltip>Remove this step</Tooltip>}>
                        <Button size="" variant="❌✖"
                          style={{ color: '#b5112a' }}
                          onClick={() => removeFields(index)}>⊝</Button>
                      </OverlayTrigger>

                    </Stack>

                    <Col md={6}>
                      <Form.Control as="textarea"
                        // size="lg" type="text"
                        name='description'
                        placeholder='Description'
                        rows={2}
                        onChange={event => handleFormChange(event, index)}
                        value={form.description}
                      />

                    </Col>

                    <Col>
                      <FloatingLabel controlId="temp" label="Temperature (°C)">
                        <Form.Control
                          name='temperature'
                          placeholder='Temperature'
                          onChange={event => handleFormChange(event, index)}
                          value={form.temperature ? form.temperature : null}
                          defaultValue={'-'}
                        />
                      </FloatingLabel>
                    </Col>

                    <Col>
                      <FloatingLabel controlId="dur" label="Duration (mins)">
                        <Form.Control
                          name='duration'
                          placeholder='Duration'
                          onChange={event => handleFormChange(event, index)}
                          value={form.duration ? form.duration : null}
                          defaultValue={'-'}
                        />
                      </FloatingLabel>
                    </Col>

                    <Col>
                      <UploadImages />
                    </Col>

                  </Row>
                  <hr className="m-4" />



                </div>
              )
            })}
          </Form>

          <OverlayTrigger className="me-auto" placement="right"
            delay={{ show: 50, hide: 100 }}
            overlay={<Tooltip>Add Step</Tooltip>}>
            <Button variant="dark" onClick={addFields}>+ Add Steps</Button>
          </OverlayTrigger>
          <br /><br />

          {/* <div align="center">
            <OverlayTrigger className="me-auto" placement="top"
              delay={{ show: 50, hide: 100 }}
              overlay={<Tooltip>Submit Recipe</Tooltip>}>
              <Button variant="success" onClick={submit}>Submit</Button>
            </OverlayTrigger>
          </div> */}


        </Modal.Body>
        <Modal.Footer>
          <OverlayTrigger className="me-auto" placement="top"
            delay={{ show: 50, hide: 100 }}
            overlay={<Tooltip>Submit Recipe</Tooltip>}>
            <Button variant="success" style={{ width: "15vw" }} onClick={submit}>
              <h5 className="mt-1">Submit</h5>
            </Button>
          </OverlayTrigger>
        </Modal.Footer>
      </Modal>



      <Modal animation={true}
        size="lg"
        centered
        show={briefShow}
        onHide={() => { setBriefShow(false) }} >
        <Modal.Header closeButton><Modal.Title>{page.name}</Modal.Title></Modal.Header>
        <Modal.Body>
          <Stack direction="horizontal" gap={3}>
            <div>
              <Form.Control
                style={{ width: "40vw" }}
                name='brief' ref={briefText} placeholder='Add brief description of filling :' />
            </div>
            <Button className="px-3 ms-auto" size="sm" variant="success"
              onClick={handleBrief}>
              Submit
            </Button>
          </Stack>
        </Modal.Body>
      </Modal>

    </div>

  )

};

export default Filling