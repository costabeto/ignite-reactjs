import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Header } from '../../components/Header';
import { Pagination } from '../../components/Pagination';
import Sidebar from '../../components/Sidebar';

const UserList = () => {
  return (
    <Box>
      <Header />

      <Flex w='100%' my='6' maxWidth={1480} mx='auto' px='6'>
        <Sidebar />

        <Box flex='1' borderRadius={8} bg='gray.800' p='8'>
          <Flex mb='8' justify='space-between' align='center'>
            <Heading size='lg' fontWeight='normal'>
              Usuários
            </Heading>

            <Button
              as='a'
              size='sm'
              fontSize='sm'
              colorScheme='pink'
              ml='4'
              leftIcon={<Icon as={RiAddLine} fontSize={21} />}
              cursor='pointer'
            >
              Criar novo usuário
            </Button>
          </Flex>

          <Table>
            <Thead>
              <Th px='6' color='gray.300' w='8'>
                <Checkbox colorScheme='pink' />
              </Th>
              <Th>Usuário</Th>
              <Th>Data de cadastro</Th>
              <Th w={0}></Th>
            </Thead>

            <Tbody>
              <Tr>
                <Td px='6'>
                  <Checkbox colorScheme='pink' />
                </Td>
                <Td>
                  <Box>
                    <Text fontWeight='bold'>Usuario Test</Text>
                    <Text fontSize='sm' color='gray.300'>
                      test@test.com
                    </Text>
                  </Box>
                </Td>
                <Td>04 de Abril, 2022</Td>

                <Td>
                  <Button
                    as='a'
                    size='sm'
                    fontSize='sm'
                    colorScheme='purple'
                    ml='4'
                    leftIcon={<Icon as={RiPencilLine} fontSize={16} />}
                    cursor='pointer'
                  >
                    Editar
                  </Button>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserList;
