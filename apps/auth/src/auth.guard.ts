// import * as Mustache from 'mustache';
// import { Reflector } from '@nestjs/core';
// import { map, size } from 'lodash';
// import { JwtService } from '@nestjs/jwt';
// import { Request } from 'express';

// import {
//   CanActivate,
//   ExecutionContext,
//   ForbiddenException,
//   Injectable,
//   InternalServerErrorException,
//   NotFoundException,
//   UnauthorizedException,
// } from '@nestjs/common';

// import {
//   subject,
//   RawRuleOf,
//   MongoAbility,
//   ForcedSubject,
//   ForbiddenError,
//   createMongoAbility
// } from '@casl/ability';
// import { actions, subjects } from '@app/common/constant';
// import { CHECK_ABILITY, RequiredRule } from './abilities.decorator';
// import { PrismaService } from '@app/common/database/database.service';
// import { saveUser } from '@app/common/entitiy';

// export type Abilities = [
//   (typeof actions)[number],
//   (
//     | (typeof subjects)[number]
//     | ForcedSubject<Exclude<(typeof subjects)[number], 'all'>>
//   )
// ];

// export type AppAbility = MongoAbility<Abilities>;

// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private jwtService: JwtService, private prisma: PrismaService, private reflector: Reflector) { }

//   createAbility = (rules: RawRuleOf<AppAbility>[]) =>
//     createMongoAbility<AppAbility>(rules);

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const rules: any =
//       this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
//       [];
//     const request = context.switchToHttp().getRequest();
//     const token = this.extractTokenFromHeader(request);
//     if (!token) {
//       throw new UnauthorizedException();
//     }
//     try {
//       const payload = await this.jwtService.verifyAsync(
//         token,
//         {
//           secret: process.env.JWT_SECRET,
//         }
//       );

//       const currentUser = await this.prisma.user.findUnique({
//         where: {
//           id: payload.sub
//         },
//         select: {
//           id: true,
//           first_name: true,
//           last_name: true,
//           username: true,
//           email: true,
//           role_id: true,
//           role: {
//             select: {
//               name: true,
//             }
//           },
//         }
//       });

//       if (!currentUser) {
//         throw new UnauthorizedException('User data not found');
//       }

//       const userPermissions = await this.prisma.permission.findMany({
//         where: {
//           role_id: currentUser.role_id,
//         },
//         select: {
//           action: true,
//           subject: true,
//           conditions: true,
//           reason: true,
//           inverted: true,
//         }
//       });

//       const parsedUserPermissions = this.parseCondition(
//         userPermissions,
//         currentUser
//       );

//       const ability = this.createAbility(Object(parsedUserPermissions));

//       for await (const rule of rules) {
//         let sub: any = {};

//         if (size(rule?.conditions)) {
//           const subId = request.params['id'];
//           console.log('Fetching subject:', subId, 'for subject type:', rule.subject);
//           sub = await this.getSubjectById(subId, rule.subject);
//           console.log('Fetched subject:', sub);

//           // Parse the rule conditions similar to how permissions are parsed
//           const parsedRuleConditions = this.parseRuleConditions(rule.conditions, currentUser);
//           console.log('Rule conditions:', rule.conditions);
//           console.log('Parsed rule conditions:', parsedRuleConditions);

//           // Check if the subject meets the conditions
//           const meetsConditions = this.checkConditions(parsedRuleConditions, sub);
//           if (!meetsConditions) {
//             throw new ForbiddenException('You are not allowed to access this resource');
//           }
//         }

//         // For rules with conditions, we've already validated above, so we can allow the action
//         if (size(rule?.conditions)) {
//           continue; // Skip CASL check since we handled it manually
//         }

//         if (rule?.inverted) {
//           ForbiddenError.from(ability)
//             .setMessage('You are not allowed to perform this action')
//             .throwUnlessCan(rule.action, subject(rule.subject, sub));
//           continue;
//         }

//         ForbiddenError.from(ability)
//           .setMessage('You are not allowed to perform this action')
//           .throwUnlessCan(rule.action, subject(rule.subject, sub));
//       }
//       request['user'] = currentUser;
//     } catch (error) {
//       console.error('error', error);
//       if (error instanceof ForbiddenError) {
//         throw new ForbiddenException(error.message);
//       }
//       if (error instanceof ForbiddenException) {
//         throw error;
//       }
//       if (error.name === 'JsonWebTokenError') {
//         throw new UnauthorizedException('Invalid token');
//       }
//       if (error.name === 'TokenExpiredError') {
//         throw new UnauthorizedException('Token expired');
//       }
//       if (error instanceof InternalServerErrorException) {
//         throw new InternalServerErrorException('Internal server error');
//       }
//       throw new UnauthorizedException("Unauthorized");
//     }
//     return true;
//   }

//   private extractTokenFromHeader(request: Request): string | undefined {
//     const [type, token] = request.headers.authorization?.split(' ') ?? [];
//     return type === 'Bearer' ? token : undefined;
//   }

//   parseCondition(permissions: any, currentUser: saveUser) {
//     return map(permissions, (permission) => {
//       if (size(permission.conditions)) {
//         const parsedConditions: Record<string, any> = {};

//         for (const [key, template] of Object.entries(permission.conditions)) {
//           const rendered = Mustache.render(template as string, currentUser);
//           parsedConditions[key] = isNaN(Number(rendered)) ? rendered : Number(rendered);
//         }

//         return {
//           ...permission,
//           conditions: parsedConditions,
//         };
//       }

//       return permission;
//     });
//   }

//   /**
//    * Parse rule conditions from decorator, similar to how permissions are parsed
//    */
//   private parseRuleConditions(ruleConditions: any, currentUser: saveUser): Record<string, any> {
//     const parsedConditions: Record<string, any> = {};

//     for (const [key, value] of Object.entries(ruleConditions)) {
//       if (typeof value === 'string' && currentUser[value as keyof saveUser]) {
//         // If the condition value refers to a user property (like 'id'), get the actual value
//         parsedConditions[key] = currentUser[value as keyof saveUser];
//       } else {
//         parsedConditions[key] = value;
//       }
//     }

//     return parsedConditions;
//   }

//   /**
//    * Check if the subject meets the required conditions
//    */
//   private checkConditions(conditions: any, subject: any): boolean {
//     for (const [key, expectedValue] of Object.entries(conditions)) {
//       // Check if the subject has the required property and it matches
//       if (subject[key] !== expectedValue) {
//         console.log(`Condition check failed: ${key} = ${subject[key]} !== ${expectedValue}`);
//         return false;
//       }
//     }
//     console.log('All conditions met');
//     return true;
//   }

//   async getSubjectById(id: string, subName: string) {
//     console.log('getSubjectById', id, subName);

//     // Handle different ID types - some might be UUID strings, others might be numbers
//     let whereClause: any = {};

//     // Try to determine if this is a UUID or a number
//     if (id.includes('-')) {
//       // Likely a UUID
//       whereClause.id = id;
//     } else if (!isNaN(Number(id))) {
//       // Likely a number
//       whereClause.id = Number(id);
//     } else {
//       // Default to string
//       whereClause.id = id;
//     }

//     try {
//       const subject = await this.prisma[subName].findUnique({
//         where: whereClause
//       });

//       if (!subject) {
//         throw new NotFoundException(`${subName} with id ${id} not found`);
//       }

//       return subject;
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw error;
//       }
//       console.error(`Error fetching ${subName} with id ${id}:`, error);
//       throw new InternalServerErrorException(`Failed to fetch ${subName}`);
//     }
//   }
// }