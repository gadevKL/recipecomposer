import { useState, useEffect } from 'react';
import { dbP } from '../firebase/config-prod';
import { ListGroup } from 'react-bootstrap';

const useGetFilling = (props) => {
    const [val, setVal] = useState([<ListGroup.Item key="NaN"> None </ListGroup.Item>]);
    // const [page, setPage] = useState('empty');

    useEffect(() => {

        var final = [];

        dbP.collection("package_list").where('type', '==', 'summary')
            .get().then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    var docs = querySnapshot.docs.map(doc => doc.data());
                    console.log(docs)
                    var tot = Object.assign(docs[0], docs[1], docs[2], docs[3], docs[4])
                    var fil = [];

                    delete tot['id']
                    delete tot['type']

                    //console.log(tot)
                    for (let tkey in tot) {

                        //console.log(tot[tkey].recipe_record)

                        var fillingList = tot[tkey].recipe_record;

                        for (let recipekey in fillingList) {
                            // console.log(fillingList[recipekey])
                            // console.log(fillingList[recipekey].filling_code)
                            if (fillingList[recipekey].filling_code !== undefined) {
                                fil.push(fillingList[recipekey])
                            }

                        }
                    }
                    console.log(fil)

                    const result = fil.filter((thing, index, self) =>
                        index === self.findIndex((t) => (
                            t.filling_code === thing.filling_code
                        ))
                    )
                    console.log(result)
                    // const obj = [...new Map(fil.map(item => [JSON.stringify(item), item])).values()];
                    // console.log(obj);
                    result.forEach(item =>
                        final.push(
                            // <ListGroup.Item action key={item.filling_code} onClick={() => setPage(item)}>
                            //     {item.filling_name}
                            // </ListGroup.Item>
                        )
                    )

                    // setPage(docs[0])
                    setVal(final);

                }
                else {
                    console.log('No match')
                    // setPage('empty')
                    // setVal(
                    //   <ListGroup.Item key="NaN" >
                    //     No task
                    //   </ListGroup.Item>
                    // )
                }
            }).catch(error => { console.log(error) });

    }, []);

    return { val };
}

export default useGetFilling;