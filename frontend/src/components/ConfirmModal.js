import React from 'react'
import { Button, Modal } from 'semantic-ui-react'

const ConfirmModal = ({ confirm , setOpen , open }) => {
  return(
    <Modal
      open= {open}
      closeOnEscape= {false}
      closeOnDimmerClick={false}
    >
      <Modal.Header >Confirm</Modal.Header>
      <Modal.Content>{confirm.title}</Modal.Content>
      <Modal.Actions>
        <Button positive onClick= {() => {
          confirm.fn()
          setOpen(false)
        }
        }>Confirm </Button>
        <Button negative  onClick= {() => setOpen(false)}>Cancel </Button>
      </Modal.Actions>
    </Modal>
  )

}

export default ConfirmModal