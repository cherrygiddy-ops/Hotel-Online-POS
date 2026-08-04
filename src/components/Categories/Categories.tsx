import useCategories from "@/hooks/useCategories";
import useProductQueryStore from "@/Store/ProductQueryStore";
import {
  Button,
  Heading,
  HStack,
  List,
  ListItem,
  Spinner,
  Text,
} from "@chakra-ui/react";

const Categories = () => {
  const  setCategory  = useProductQueryStore(s => s.setCategory);
   const  categoryId  = useProductQueryStore((s) => s.productQuery.categoryId);
  const { data: categories, error, isLoading } = useCategories();
  return (
    <>
      {error && <Text></Text>}
      {isLoading && <Spinner></Spinner>}
      <Heading marginBottom={3} fontSize="2xl">
        Categories
      </Heading>
      <List>
        {categories?.map((categ) => (
          <ListItem key={categ.id} paddingY={3}>
            <HStack>
              <Button
                whiteSpace="normal"
                textAlign="left"
                objectFit="cover"
                fontWeight={categ.id === categoryId ? "bold" : "normal"}
                fontSize="lg"
                variant="link"
                onClick={() => setCategory(categ.id)}>
                {" "}
                {categ.name}
              </Button>
            </HStack>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Categories;
