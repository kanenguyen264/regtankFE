const actions = {
    CHAGE_FIELD_REQUEST: 'CHAGE_FIELD_REQUEST',
    CHAGE_FIELD_SUCCESS: 'CHAGE_FIELD_SUCCESS',
    CHAGE_FIELD_ERROR: 'CHAGE_FIELD_ERROR',
    changeField: (payload) => ({
        type: actions.CHAGE_FIELD_REQUEST,
        payload,
    })
}

export default actions;