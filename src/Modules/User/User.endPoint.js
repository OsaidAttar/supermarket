import {roles} from '../../MiddelWare/auth.middelware.js'
export const endpoint={
    create:[roles.SuperAdmin],
    update:[roles.SuperAdmin],
    delete:[roles.SuperAdmin],
    getAllAdmin:[roles.SuperAdmin],
}