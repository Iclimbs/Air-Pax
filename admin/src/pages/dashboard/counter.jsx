import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Chip
} from "@material-tailwind/react";
import React from "react";
import { outletTableData } from "@/data";
import { CounterModal } from "@/widgets/modals/Creation/counter-modal";
import CounterConfirmModal from "@/widgets/modals/Confirmation/counter-confirm-modal";

export function Counter() {
  const [showmodal, setShowModal] = React.useState(false)
  const [showConfirmModal, setShowConfirmModal] = React.useState(false)
  const [data, setData] = React.useState([])
  const [selectedData, setSelectedData] = React.useState([])

  console.log("data ", selectedData);

  React.useEffect(() => {
    fetch('http://localhost:4500/api/v1/counter/listall')
      .then((response) => response.json())
      .then(data => {
        setData(data.data)
      })
      .catch(error => {
        console.error(error);
      })
  }, [])

  const handleModal = () => {
    setSelectedData([])
    setShowModal(!showmodal)
  }

  const handleSelect = (item) => {
    setShowModal(!showmodal)
    setSelectedData(item)

  }

  const handleConfirmModal = (item) => {
    setSelectedData(item)
    setShowConfirmModal(!showConfirmModal)
  }

  const toggleConfirmModal = () => {
    setSelectedData([])
    setShowConfirmModal(!showConfirmModal)
  }

  return (
    <>
      <CounterConfirmModal showmodal={showConfirmModal} toggleConfirmModal={toggleConfirmModal} data={selectedData} endpoint="/api/v1/counter/disable/" />
      <CounterModal showmodal={showmodal} handleModal={handleModal} data={selectedData} />
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/background-image.png')] bg-cover	bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 flex justify-between">
          <Typography variant="h6" color="white">
            Outlets
          </Typography>
          <Button variant="filled" color="white" className="text-sm" onClick={handleModal}>
            Add New
          </Button>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {outletTableData.map((el) => (
                  <th
                    key={el}
                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                  >
                    <Typography
                      variant="small"
                      className="text-[11px] font-bold uppercase text-blue-gray-400"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data && data.map(
                (el, key) => {
                  const className = `py-3 px-5 ${key === data.length - 1
                    ? ""
                    : "border-b border-blue-gray-50"
                    }`;

                  return (
                    <tr key={el.name}>
                      <td className={className}>
                        <div className="flex items-center gap-4">
                          <div>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-semibold"
                            >
                              <a href={el.location} target="_blank" rel="noopener noreferrer">
                                {el.name}
                              </a>
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {el.city}
                        </Typography>
                      </td>
                      <td className={className}>
                        <Chip
                          variant="gradient"
                          color={el.status.enabled ? "green" : "blue-gray"}
                          value={el.status.enabled ? "online" : "offline"}
                          className="py-0.5 px-2 text-[11px] font-medium w-fit"
                        />
                      </td>
                      <td className={className}>
                        <Typography className="text-xs font-semibold text-blue-gray-600">
                          {el.phoneno}
                        </Typography>
                      </td>
                      <td className={`${className} flex w-max gap-4`}>
                        <Button
                          variant="text"
                          color="blue"
                          ripple={true}
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() => {
                            handleSelect(el)
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="text"
                          color="red"
                          ripple={true}
                          className="text-xs font-semibold text-blue-gray-600"
                          onClick={() => { handleConfirmModal(el) }}
                        >
                          {el.status.disabled ?  "Enable" :"Disable"}
                        </Button>

                      </td>
                    </tr>
                  );
                }
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </>
  );
}

export default Counter;
