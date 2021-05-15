import { useDispatch } from 'react-redux';
import { AXIOS_CONFIG_JOUR_SEMAINE } from './../query';
import { utiliserConfigAction } from './../redux/hook-action';

export function utiliserConfig() {
    const dispatch = useDispatch();
    dispatch(utiliserConfigAction());
}

export function utiliserConfig2() {
    console.log('besoin de dispatch -> dispatch(utiliserConfigAction())');
    
}