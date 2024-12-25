import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { RoleService } from './role.service';
import { ResponseUtil } from 'src/util/response.util';
import { ResponseDTO } from 'src/dto/response.dto';
import { CreateRoleRequestDTO } from './dto/create-role-request.dto';
import { CreateRoleResponseDTO } from './dto/create-role-response.dto';
import { RoleInfoResponseDTO } from './dto/role-info-response.dto';
import { ListRoleRequestDTO } from './dto/list-role-request.dto';
import { ListRoleResponseDTO } from './dto/list-role-response.dto';

@Controller('/role')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private responseUtil: ResponseUtil,
  ) {}

  @Post()
  async create(
    @Body() request: CreateRoleRequestDTO,
  ): Promise<ResponseDTO<CreateRoleResponseDTO>> {
    const roleResponseDTO = await this.roleService.create(request);
    return this.responseUtil.successResponse(0, roleResponseDTO);
  }

  @Get('/:id/info')
  async getRoleInfo(
    @Param('id') id: number,
  ): Promise<ResponseDTO<RoleInfoResponseDTO>> {
    const responseDTO = await this.roleService.getRoleInfo(id);
    return this.responseUtil.successResponse(0, responseDTO);
  }

  @Get('/getAllRoles')
  async getRoleList(
    @Query() requestDTO: ListRoleRequestDTO,
  ): Promise<ResponseDTO<ListRoleResponseDTO>> {
    console.log(requestDTO.limit);
    const responseDTO =
      await this.roleService.getAllRolesWithSearchCriteria(requestDTO);
    return this.responseUtil.successResponse(0, responseDTO);
  }
}
