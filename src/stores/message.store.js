import { observable, action, computed} from "mobx";

class MessageStore {
    @observable modalState = false
    @observable modalMessage = ""
    @observable modalTitle = ""
    
    @action openModal(title, message) {
        this.modalMessage = message
        this.modalTitle = title
        this.modalState = true
    }

    @action closeModal() {
        this.modalMessage = ""
        this.modalTitle = ""
        this.modalState = false
    }

    @computed get getModalState(){
        return this.modalState
    }
    
    @computed get getModalMessage(){
        return this.modalMessage
    }

    @computed get getModalTitle(){
        return this.modalTitle
    }
}

export default new MessageStore()