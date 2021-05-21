import { useDispatch } from 'react-redux';
import { utiliserConfigAction } from './../redux/hook-action';

export function useToTriggerConfig(configADeclencher: string) {
    const dispatch = useDispatch();
    dispatch(utiliserConfigAction(configADeclencher));
}
