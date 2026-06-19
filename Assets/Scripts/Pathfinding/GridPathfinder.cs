using System;
using System.Collections.Generic;
using UnityEngine;

namespace Aslant.Pathfinding
{
    public static class GridPathfinder
    {
        static readonly Vector2Int[] NeighborOffsets =
        {
            new(0, 1),
            new(1, 0),
            new(0, -1),
            new(-1, 0),
        };

        public static List<Vector2Int> FindPath(
            Vector2Int start,
            Vector2Int goal,
            int width,
            int depth,
            Func<Vector2Int, bool> isWalkable)
        {
            if (start == goal)
            {
                return new List<Vector2Int> { start };
            }

            if (!IsInsideGrid(start, width, depth) || !IsInsideGrid(goal, width, depth))
            {
                return null;
            }

            if (!isWalkable(start) || !isWalkable(goal))
            {
                return null;
            }

            var openSet = new List<Vector2Int> { start };
            var cameFrom = new Dictionary<Vector2Int, Vector2Int>();
            var gScore = new Dictionary<Vector2Int, float> { [start] = 0f };
            var fScore = new Dictionary<Vector2Int, float> { [start] = Heuristic(start, goal) };

            while (openSet.Count > 0)
            {
                var current = PopLowestFScore(openSet, fScore);

                if (current == goal)
                {
                    return ReconstructPath(cameFrom, current);
                }

                openSet.Remove(current);

                foreach (var offset in NeighborOffsets)
                {
                    var neighbor = current + offset;
                    if (!IsInsideGrid(neighbor, width, depth) || !isWalkable(neighbor))
                    {
                        continue;
                    }

                    var tentativeG = gScore[current] + 1f;
                    if (gScore.TryGetValue(neighbor, out var knownG) && tentativeG >= knownG)
                    {
                        continue;
                    }

                    cameFrom[neighbor] = current;
                    gScore[neighbor] = tentativeG;
                    fScore[neighbor] = tentativeG + Heuristic(neighbor, goal);

                    if (!openSet.Contains(neighbor))
                    {
                        openSet.Add(neighbor);
                    }
                }
            }

            return null;
        }

        static bool IsInsideGrid(Vector2Int cell, int width, int depth)
        {
            return cell.x >= 0 && cell.x < width && cell.y >= 0 && cell.y < depth;
        }

        static float Heuristic(Vector2Int a, Vector2Int b)
        {
            return Mathf.Abs(a.x - b.x) + Mathf.Abs(a.y - b.y);
        }

        static Vector2Int PopLowestFScore(List<Vector2Int> openSet, Dictionary<Vector2Int, float> fScore)
        {
            var bestIndex = 0;
            var bestScore = float.MaxValue;

            for (var i = 0; i < openSet.Count; i++)
            {
                var cell = openSet[i];
                var score = fScore.TryGetValue(cell, out var value) ? value : float.MaxValue;
                if (score < bestScore)
                {
                    bestScore = score;
                    bestIndex = i;
                }
            }

            return openSet[bestIndex];
        }

        static List<Vector2Int> ReconstructPath(Dictionary<Vector2Int, Vector2Int> cameFrom, Vector2Int current)
        {
            var path = new List<Vector2Int> { current };
            while (cameFrom.TryGetValue(current, out var previous))
            {
                current = previous;
                path.Add(current);
            }

            path.Reverse();
            return path;
        }
    }
}
