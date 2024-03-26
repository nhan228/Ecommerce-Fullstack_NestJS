import { InputGroup, Form } from 'react-bootstrap';
import { productAction } from '@/store/slices/product.slice';
import api from '@services/apis'
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd';
import { Store } from '@/store';
import { useState } from 'react';
import Load from '@/components/load-form'

export default function DetailShow({ showDetail, setShowDetail, updateData }: any) {
  const [load, setLoad] = useState<boolean>(false)
  const productStore = useSelector((store: Store) => store.productStore)
  const categoryStore = useSelector((store: Store) => store.categoryStore)
  console.log(updateData);
  const brandStore = useSelector((store: Store) => store.brandStore)
  const dispatch = useDispatch();
  const computerType = ['Laptop', 'PC']
  const phoneType = ['Phone']

  const handleEditDetailCom = async (e: any) => {
    e.preventDefault()
    try {
      let detail = JSON.stringify({
        brand: e.target.brand.value,
        category: e.target.category.value,
        name: e.target.name.value,
        guarantee: e.target.guarantee.value,
        warrantyDes: e.target.warrantyDes.value,
        series: e.target.series.value,
        partNum: e.target.partNum.value,
        CPUgen: e.target.CPUgen.value,
        CPU: e.target.CPU.value,
        graphic: e.target.graphic.value,
        RAM: e.target.RAM.value,
        screen: e.target.screen.value,
        storage: e.target.storage.value,
        storagePort: e.target.storagePort.value,
        connector: e.target.connector.value,
        M2Port: e.target.M2Port.value,
        outputPort: e.target.outputPort.value,
        wireless: e.target.wireless.value,
        battery: e.target.battery.value,
        keyboard: e.target.keyboard.value,
        system: e.target.system.value,
        size: e.target.size.value,
        mass: e.target.mass.value
      })
      setLoad(true)
      let result = await api.productApi.updateDes(updateData.id, { detail: detail })
      console.log('resutl', result);
      if (result.status == 200) {
        Modal.success({
          title: 'Success!',
          content: "Update technical specifications successfully!",
          onOk: () => {
            setLoad(false)
            dispatch(productAction.update(result.data.data))
            setShowDetail(!showDetail)
          }
        })

      }
    } catch (err) {
      console.log('err', err);
    }
  }

  const handleEditDetailPhone = async (e: any) => {
    e.preventDefault()
    try {
      let detail = JSON.stringify({
        brand: e.target.brand.value,
        category: e.target.category.value,
        name: e.target.name.value,
        guarantee: e.target.guarantee.value,
        warrantyDes: e.target.warrantyDes.value,
        series: e.target.series.value,
        screen: e.target.screen.value,
        resolution: e.target.resolution.value,
        chip: e.target.chip.value,
        storage: e.target.storage.value,
        battery: e.target.battery.value,
        batteryTech: e.target.batteryTech.value,
        system: e.target.system.value,
        chargPort: e.target.chargPort.value,
        sim: e.target.sim.value,
        mobileNet: e.target.mobileNet.value,
        rearCam: e.target.rearCam.value,
        fontCam: e.target.fontCam.value,
        WIFI: e.target.WIFI.value,
        GPS: e.target.GPS.value,
        bluetooth: e.target.bluetooth.value,
        headjack: e.target.headjack.value,
        size: e.target.size.value,
        mass: e.target.mass.value
      })
      setLoad(true)
      let result = await api.productApi.updateDes(updateData.id, { detail: detail })
      if (result.status == 200) {
        Modal.success({
          title: 'Success!',
          content: "Update technical specifications successfully!",
          onOk: () => {
            setLoad(false)
            dispatch(productAction.update(result.data.data))
            setShowDetail(!showDetail)
          }
        })

      }
    } catch (err) {
      console.log('err', err);
    }
  }

  return (
    <div className='product_detail_form'>
      <div className='form_container'>
        <div className='btn_box'>
          <h2>Technical specifications</h2>
          <button onClick={() => {
            setShowDetail(!showDetail)
          }} type='button' className='btn btn-danger'>X</button>
        </div>
        {
          <form onSubmit={(e) => {
            handleEditDetailCom(e)
          }}>
            {load && <Load />}

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Brand</InputGroup.Text>
              <Form.Select name='brand' aria-label="Default select example">
                <option value={updateData.detail.brand}>{updateData.detail.brand}</option>
                {
                  brandStore?.data?.map(item => (
                    <option key={Date.now() * Math.random()} value={item.title}>{item.title}</option>
                  ))
                }
              </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Category</InputGroup.Text>
              <Form.Select name='category' aria-label="Default select example">
                <option value={updateData.detail.category}>{updateData.detail.category}</option>
                {
                  categoryStore?.category?.map((item: any) => (
                    <option key={Date.now() * Math.random()} value={item.title}>{item.title}</option>
                  ))
                }
              </Form.Select>
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Name</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='name'
                defaultValue={updateData.detail.name || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Guarantee</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='guarantee'
                defaultValue={updateData.detail.guarantee || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Warranty Describle</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='warrantyDes'
                defaultValue={updateData.detail.warrantyDes || ""}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Series</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='series'
                defaultValue={updateData.detail.series || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Part-number</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='partNum'
                defaultValue={updateData.detail.partNum || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Color</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='color'
                defaultValue={updateData.detail.color || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Demand</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='demand'
                defaultValue={updateData.detail.demand || ""}
              />
            </InputGroup>
            <h4> Detailed configuration</h4>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">CPU generation</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='CPUgen'
                defaultValue={updateData.detail.CPUgen || ""}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">CPU</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='CPU'
                defaultValue={updateData.detail.CPU || ""}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Graphics chips</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='graphic'
                defaultValue={updateData.detail.graphic || ""}
              />
            </InputGroup>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">RAM</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='RAM'
                defaultValue={updateData.detail.RAM || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Screen</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='screen'
                defaultValue={updateData.detail.screen || ""}
              />
            </InputGroup>

            {/* Storage */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Storage</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='storage'
                defaultValue={updateData.detail.storage || ""}
              />
            </InputGroup>

            {/* Port */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Max number of storage ports</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='storagePort'
                defaultValue={updateData.detail.storagePort || ""}
              />
            </InputGroup>

            {/*  M.2 support */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">M.2 slot type supported</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='M2Port'
                defaultValue={updateData.detail.M2Port || ""}
              />
            </InputGroup>

            {/* Output */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Output port</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='outputPort'
                defaultValue={updateData.detail.outputPort || ""}
              />
            </InputGroup>

            {/* Connector */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Connector</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='connector'
                defaultValue={updateData.detail.connector || ""}
              />
            </InputGroup>

            {/* Wireless */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Wireless Connectivity</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='wireless'
                defaultValue={updateData.detail.wireless || ""}
              />
            </InputGroup>

            {/* Keybord */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Keyboard</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='keyboard'
                defaultValue={updateData.detail.keyboard || ""}
              />
            </InputGroup>

            {/* Operating sytem */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Operating system</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='system'
                defaultValue={updateData.detail.system || ""}
              />
            </InputGroup>

            {/* Size */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Size</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='size'
                defaultValue={updateData.detail.size || ""}
              />
            </InputGroup>

            {/* Battery */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">The battery</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='battery'
                defaultValue={updateData.detail.battery || ""}
              />
            </InputGroup>

            {/* Mass */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Mass</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='mass'
                defaultValue={updateData.detail.mass || ""}
              />
            </InputGroup>
            <h4>Other information</h4>
            <h4>Size information</h4>
            {
              productStore.data?.map((product: any) => {
                if (product.status) {
                  return (
                    <div className='load-contanier'>
                      <div className='load-group'>
                        {load && <Load />}
                        <button type='submit' className='btn btn-success'>Save</button>
                      </div>
                    </div>
                  )
                }
              }
              )
            }
          </form>
        }

        {
          phoneType.find(item => item == updateData.category) && <form onSubmit={(e) => {
            handleEditDetailPhone(e)
          }}>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Brand</InputGroup.Text>
              <Form.Select name='brand' aria-label="Default select example">
                <option value={updateData.detail.brand}>{updateData.detail.brand}</option>
                {
                  brandStore?.data?.map(item => (
                    <option key={Date.now() * Math.random()} value={item.title}>{item.title}</option>
                  ))
                }
              </Form.Select>
            </InputGroup>

            {/* Category */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Category</InputGroup.Text>
              <Form.Select name='category' aria-label="Default select example">
                <option value={updateData.detail.category}>{updateData.detail.category}</option>
                {
                  categoryStore?.category?.map((item: any) => (
                    <option key={Date.now() * Math.random()} value={item.title}>{item.title}</option>
                  ))
                }
              </Form.Select>
            </InputGroup>

            {/* Name */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Name</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='name'
                defaultValue={updateData.detail.name || ""}
              />
            </InputGroup>

            {/* Guarantee */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Guarantee</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='guarantee'
                defaultValue={updateData.detail.guarantee || ""}
              />
            </InputGroup>

            {/* Warranty */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Warranty Description</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='warrantyDes'
                defaultValue={updateData.detail.warrantyDes || ""}
              />
            </InputGroup>

            {/* Series */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Series</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='series'
                defaultValue={updateData.detail.series || ""}
              />
            </InputGroup>

            {/* Color */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Color</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='color'
                defaultValue={updateData.detail.color || ""}
              />
            </InputGroup>

            {/* SCREEN */}
            <h4>Screen</h4>
            {/* data */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Screen</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='screen'
                defaultValue={updateData.detail.screen || ""}
              />
            </InputGroup>

            {/* resolution */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Resolution</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='resolution'
                defaultValue={updateData.detail.resolution || ""}
              />
            </InputGroup>

            {/* CONFIG */}
            <h4>Configuration</h4>
            {/* chipset */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Chipset</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='chip'
                defaultValue={updateData.detail.chip || ""}
              />
            </InputGroup>

            {/* storage */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Storage</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='storage'
                defaultValue={updateData.detail.storage || ""}
              />
            </InputGroup>

            {/* operating system */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Operating system</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='system'
                defaultValue={updateData.detail.system || ""}
              />
            </InputGroup>

            {/* battery */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">The battery</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='battery'
                defaultValue={updateData.detail.battery || ""}
              />
            </InputGroup>

            {/* battery tech */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Battery technology</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='batteryTech'
                defaultValue={updateData.detail.batteryTech || ""}
              />
            </InputGroup>

            {/* charging */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Charging port</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='chargPort'
                defaultValue={updateData.detail.chargPort || ""}
              />
            </InputGroup>

            {/* sim */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Sim type</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='sim'
                defaultValue={updateData.detail.sim || ""}
              />
            </InputGroup>

            {/* network */}
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Mobile network</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='mobileNet'
                defaultValue={updateData.detail.mobileNet || ""}
              />
            </InputGroup>

            {/* CAM */}
            <h4>Camera</h4>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Rear camera</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='rearCam'
                defaultValue={updateData.detail.rearCam || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Front camera</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='fontCam'
                defaultValue={updateData.detail.fontCam || ""}
              />
            </InputGroup>

            {/* CONNECT */}
            <h4>Connect</h4>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">WIFI</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='WIFI'
                defaultValue={updateData.detail.WIFI || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">GPS</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='GPS'
                defaultValue={updateData.detail.GPS || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Bluetooth</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='bluetooth'
                defaultValue={updateData.detail.bluetooth || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Headphone jack</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='headjack'
                defaultValue={updateData.detail.headjack || ""}
              />
            </InputGroup>

            {/* DESIGN */}
            <h4>Design & weight</h4>
            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Size</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='size'
                defaultValue={updateData.detail.size || ""}
              />
            </InputGroup>

            <InputGroup className="mb-3">
              <InputGroup.Text style={{ width: "200px" }} id="basic-addon1">Mass</InputGroup.Text>
              <Form.Control
                placeholder="Updating..."
                name='mass'
                defaultValue={updateData.detail.mass || ""}
              />
            </InputGroup>

            {
              productStore.data?.map((product: any) => {
                if (product.status) {
                  return (
                    <button type='submit' className='btn btn-success'>Save</button>
                  )
                }
              }
              )
            }
          </form>
        }
      </div>
    </div>
  )
}
