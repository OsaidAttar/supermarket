import {roles} from '../../MiddelWare/auth.middelware.js'
export const endpoint={
    create:[roles.SuperAdmin, roles.Admin],
    update:[roles.SuperAdmin, roles.Admin]
}