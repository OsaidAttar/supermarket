import {roles} from '../../MiddelWare/auth.middelware.js'
export const endpoint={
    create:[roles.SuperAdmin, roles.Admin],
    update:[roles.SuperAdmin, roles.Admin],
    softdelete:[roles.SuperAdmin, roles.Admin],
forcedelete:[roles.SuperAdmin, roles.Admin],
restore:[roles.SuperAdmin, roles.Admin],
get:[roles.SuperAdmin, roles.Admin],
}